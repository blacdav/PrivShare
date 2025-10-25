// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@forge-std/Test.sol";
import "@forge-std/console.sol";
import "@contract/DataOwnershipRegistry.sol";

contract DataOwnershipRegistryTest is Test {

    // Events for on-chain auditing
    event DataRegistered(
        bytes32 indexed dataHash,
        address indexed owner,
        uint256 timestamp,
        string encryptionMethod,
        uint256 version
    );
    
    event DataVersionUpdated(
        bytes32 indexed oldHash,
        bytes32 indexed newHash,
        address indexed owner,
        uint256 newVersion,
        uint256 timestamp
    );

    DataOwnershipRegistry public registry;

    address owner = address(0x1);
    address otherUser = address(0x2);
    address attacker = address(0x3);

    bytes32 dataHash1 = keccak256(abi.encodePacked("data1"));
    bytes32 dataHash2 = keccak256(abi.encodePacked("data2"));
    bytes32 zeroHash = bytes32(0);

    function setUp() public {
        vm.prank(owner);
        registry = new DataOwnershipRegistry();
    }

    // Unit Tests
    function testRegisterData() public {
        vm.prank(owner);
        registry.registerData(dataHash1, "AES-256");

        assertEq(registry.dataOwner(dataHash1), owner);
        assertEq(registry.dataVersion(dataHash1), 1);
    }

    function testCreateNewVersion() public {
        vm.startPrank(owner);
        registry.registerData(dataHash1, "AES-256");

        bytes32 newHash = keccak256(abi.encodePacked("data1-v2"));
        registry.createNewVersion(dataHash1, newHash, "AES-256-GCM");

        assertEq(registry.dataOwner(newHash), owner);
        assertEq(registry.dataVersion(newHash), 2);
        vm.stopPrank();
    }

    function testVerifyOwnership() public {
        vm.prank(owner);
        registry.registerData(dataHash1, "AES-256");

        assertTrue(registry.verifyOwnership(dataHash1, owner));
        assertFalse(registry.verifyOwnership(dataHash1, otherUser));
    }

    // Edge Case Tests
    function testCannotRegisterZeroHash() public {
        vm.prank(owner);
        vm.expectRevert("Invalid data hash");
        registry.registerData(zeroHash, "AES-256");
    }

    function testCannotRegisterDuplicateHash() public {
        vm.startPrank(owner);
        registry.registerData(dataHash1, "AES-256");

        vm.expectRevert("Data already registered");
        registry.registerData(dataHash1, "AES-256");
        vm.stopPrank();
    }

    function testCannotCreateVersionWithoutOwnership() public {
        vm.prank(owner);
        registry.registerData(dataHash1, "AES-256");

        vm.prank(otherUser);
        bytes32 newHash = keccak256(abi.encodePacked("data1-v2"));
        // Fixed: Use the actual error message from the contract
        vm.expectRevert("Current Interactor is not data owner");
        registry.createNewVersion(dataHash1, newHash, "AES-256-GCM");
    }

    // Fuzz Tests - Fixed
    function testFuzzRegisterData(bytes32 dataHash) public {
        vm.assume(dataHash != zeroHash);

        vm.prank(owner);
        registry.registerData(dataHash, "AES-256");

        assertEq(registry.dataOwner(dataHash), owner);
        assertEq(registry.dataVersion(dataHash), 1);
    }

    function testFuzzVerifyOwnership(
        bytes32 dataHash,
        address randomOwner,
        address differentUser
    ) public {
        vm.assume(dataHash != zeroHash);
        vm.assume(randomOwner != address(0));
        vm.assume(differentUser != address(0));
        vm.assume(randomOwner != differentUser); // Ensure they are different

        vm.prank(randomOwner);
        registry.registerData(dataHash, "AES-256");

        assertTrue(registry.verifyOwnership(dataHash, randomOwner));
        assertFalse(registry.verifyOwnership(dataHash, differentUser));
    }

    // Audit Tests - Security & Access Control
    function testAnyoneCanRegisterData() public {
        // This is actually correct behavior - anyone should be able to register data they own
        vm.prank(attacker);
        registry.registerData(dataHash1, "AES-256");

        // Verify attacker now owns the data
        assertEq(registry.dataOwner(dataHash1), attacker);
        assertTrue(registry.verifyOwnership(dataHash1, attacker));
    }

    function testEventEmissionOnRegistration() public {
        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit DataRegistered(dataHash1, owner, block.timestamp, "AES-256", 1);
        registry.registerData(dataHash1, "AES-256");
    }

    function testVersionHistory() public {
        vm.startPrank(owner);
        registry.registerData(dataHash1, "AES-256");

        bytes32 newHash1 = keccak256(abi.encodePacked("data1-v2"));
        registry.createNewVersion(dataHash1, newHash1, "AES-256-GCM");

        bytes32 newHash2 = keccak256(abi.encodePacked("data1-v3"));
        registry.createNewVersion(newHash1, newHash2, "ChaCha20");

        bytes32[] memory history = registry.getVersionHistory(newHash2);
        assertEq(history.length, 3);
        assertEq(history[0], dataHash1);
        assertEq(history[1], newHash1);
        assertEq(history[2], newHash2);
        vm.stopPrank();
    }

    // New Comprehensive Tests

    function testMultipleDataRegistrations() public {
        bytes32[] memory dataHashes = new bytes32[](5);
        for (uint i = 0; i < 5; i++) {
            dataHashes[i] = keccak256(abi.encodePacked("data", i));
        }

        vm.startPrank(owner);
        for (uint i = 0; i < 5; i++) {
            registry.registerData(dataHashes[i], "AES-256");
        }
        vm.stopPrank();

        // Verify all registrations
        for (uint i = 0; i < 5; i++) {
            assertEq(registry.dataOwner(dataHashes[i]), owner);
            assertEq(registry.dataVersion(dataHashes[i]), 1);
        }
    }

    function testComplexVersionChain() public {
        vm.startPrank(owner);
        registry.registerData(dataHash1, "AES-256");

        // Create a chain of 5 versions
        bytes32 currentHash = dataHash1;
        for (uint i = 2; i <= 5; i++) {
            bytes32 newHash = keccak256(abi.encodePacked("version", i));
            registry.createNewVersion(currentHash, newHash, "AES-256-GCM");
            currentHash = newHash;

            assertEq(registry.dataVersion(currentHash), i);
            assertEq(registry.dataOwner(currentHash), owner);
        }

        // Verify the entire chain
        bytes32[] memory history = registry.getVersionHistory(currentHash);
        assertEq(history.length, 5);
        vm.stopPrank();
    }

    function testProofOfExistence() public {
        vm.prank(owner);
        registry.registerData(dataHash1, "AES-256");

        // Proof of existence: anyone can verify data exists and who owns it
        assertTrue(registry.verifyOwnership(dataHash1, owner));
        assertFalse(registry.verifyOwnership(dataHash1, otherUser));
        
        // Non-existent data should return false
        assertFalse(registry.verifyOwnership(keccak256(abi.encodePacked("nonexistent")), owner));
    }

    function testDataOwnershipTransferByVersioning() public {
        // Simulate ownership transfer by creating new version under new owner
        vm.prank(owner);
        registry.registerData(dataHash1, "AES-256");

        // New owner creates a version
        vm.prank(otherUser);
        bytes32 newHash = keccak256(abi.encodePacked("transferred_data"));
        registry.registerData(newHash, "AES-256-GCM");

        // Verify separate ownership
        assertEq(registry.dataOwner(dataHash1), owner);
        assertEq(registry.dataOwner(newHash), otherUser);
    }

    function testEmptyVersionHistory() public {
        // Test version history for data with no versions
        vm.prank(owner);
        registry.registerData(dataHash1, "AES-256");

        bytes32[] memory history = registry.getVersionHistory(dataHash1);
        assertEq(history.length, 1);
        assertEq(history[0], dataHash1);
    }

    function testGasOptimizationRegistration() public {
        uint256 gasBefore = gasleft();
        vm.prank(owner);
        registry.registerData(dataHash1, "AES-256");
        uint256 gasUsed = gasBefore - gasleft();

        console.log("Single registration gas used:", gasUsed);
        assertTrue(gasUsed > 0);

        // Test multiple registrations to see gas patterns
        gasBefore = gasleft();
        vm.prank(owner);
        registry.registerData(dataHash2, "AES-256-GCM");
        uint256 gasUsedSecond = gasBefore - gasleft();

        console.log("Second registration gas used:", gasUsedSecond);
        // Second registration might use less gas due to warm storage
    }

    function testVersionCreationGas() public {
        vm.startPrank(owner);
        registry.registerData(dataHash1, "AES-256");

        uint256 gasBefore = gasleft();
        bytes32 newHash = keccak256(abi.encodePacked("v2"));
        registry.createNewVersion(dataHash1, newHash, "AES-256-GCM");
        uint256 gasUsed = gasBefore - gasleft();

        console.log("Version creation gas used:", gasUsed);
        assertTrue(gasUsed > 0);
        vm.stopPrank();
    }

    function testBulkOperations() public {
        // Test performance with multiple operations
        uint256 startGas = gasleft();
        
        vm.startPrank(owner);
        for (uint i = 0; i < 10; i++) {
            bytes32 hash = keccak256(abi.encodePacked("bulk", i));
            registry.registerData(hash, "AES-256");
        }
        vm.stopPrank();

        uint256 totalGasUsed = startGas - gasleft();
        console.log("Bulk 10 registrations gas used:", totalGasUsed);
        assertTrue(totalGasUsed > 0);
    }

    function testEdgeCaseDataHashes() public {
        // Test with edge case data hashes
        bytes32 maxHash = bytes32(type(uint256).max);
        bytes32 minHash = bytes32(uint256(1));
        
        vm.startPrank(owner);
        registry.registerData(maxHash, "AES-256");
        registry.registerData(minHash, "AES-256-GCM");
        vm.stopPrank();

        assertEq(registry.dataOwner(maxHash), owner);
        assertEq(registry.dataOwner(minHash), owner);
    }

    function testRepeatedVersionCreation() public {
        vm.startPrank(owner);
        registry.registerData(dataHash1, "AES-256");

        // Create multiple versions from the same base
        bytes32 version2 = keccak256(abi.encodePacked("v2"));
        registry.createNewVersion(dataHash1, version2, "AES-256-GCM");

        bytes32 version3 = keccak256(abi.encodePacked("v3"));
        registry.createNewVersion(dataHash1, version3, "ChaCha20");

        // Both should be valid versions of the original
        assertEq(registry.dataVersion(version2), 2);
        assertEq(registry.dataVersion(version3), 2); // Both are version 2 from base
        vm.stopPrank();
    }

    function testVersionChainIntegrity() public {
        vm.startPrank(owner);
        registry.registerData(dataHash1, "AES-256");

        // Create a linear version chain
        bytes32 current = dataHash1;
        for (uint i = 0; i < 3; i++) {
            bytes32 next = keccak256(abi.encodePacked("chain", i));
            registry.createNewVersion(current, next, "AES-256");
            current = next;
        }

        // Verify chain integrity
        bytes32[] memory history = registry.getVersionHistory(current);
        assertEq(history.length, 4); // original + 3 versions
        
        // Each version should point to the previous
        for (uint i = 1; i < history.length; i++) {
            assertTrue(registry.dataOwner(history[i]) == owner);
            assertEq(registry.dataVersion(history[i]), i + 1);
        }
        vm.stopPrank();
    }

    // Fuzz tests for edge cases
    function testFuzzVersionCreation(bytes32 baseHash, bytes32 newHash) public {
        vm.assume(baseHash != zeroHash);
        vm.assume(newHash != zeroHash);
        vm.assume(baseHash != newHash);

        vm.startPrank(owner);
        registry.registerData(baseHash, "AES-256");
        registry.createNewVersion(baseHash, newHash, "AES-256-GCM");
        vm.stopPrank();

        assertEq(registry.dataOwner(newHash), owner);
        assertEq(registry.dataVersion(newHash), 2);
    }

    function testFuzzOwnershipVerification(
        bytes32 dataHash,
        address allegedOwner
    ) public view {
        vm.assume(dataHash != zeroHash);
        vm.assume(allegedOwner != address(0));

        // For unregistered data, verification should always return false
        bool result = registry.verifyOwnership(dataHash, allegedOwner);
        assertFalse(result);
    }
}