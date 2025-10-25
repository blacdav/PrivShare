// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@forge-std/Test.sol";
import "@contract/EncryptionKeyManagement.sol";

contract EncryptionKeyManagementTest is Test {
    EncryptionKeyManagement public keyManager;
    
    // Use the test contract itself as admin since it's the deployer
    address admin = address(this);
    address recipient1 = address(0x2);
    address recipient2 = address(0x3);
    address unauthorized = address(0x4);
    
    bytes32 dataHash1 = keccak256(abi.encodePacked("data1"));
    bytes32 dataHash2 = keccak256(abi.encodePacked("data2"));
    
    bytes encryptedKey1 = "encrypted_key_1";
    bytes encryptedKey2 = "encrypted_key_2";
    
    function setUp() public {
        // Deploy the contract - the constructor will grant DEFAULT_ADMIN_ROLE to this test contract
        keyManager = new EncryptionKeyManagement();
    }
    
    function testStoreEncryptedKey() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        // Use the admin getter function to get key info
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
            
        assertEq(keyInfo.encryptedKey, encryptedKey1);
        assertTrue(keyInfo.active);
        assertEq(keyInfo.expiryTime, block.timestamp + 3600);
    }
    
    function testKeyRotation() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey2, 7200);
        
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertEq(keyInfo.encryptedKey, encryptedKey2);
        assertEq(keyInfo.expiryTime, block.timestamp + 7200);
    }
    
    function testKeyRevocation() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        // Check initial state
        EncryptionKeyManagement.KeyInfo memory initialKeyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertTrue(initialKeyInfo.active);
        
        keyManager.revokeKey(dataHash1, recipient1);
        
        // Check state after revocation
        EncryptionKeyManagement.KeyInfo memory revokedKeyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertFalse(revokedKeyInfo.active);
    }
    
    function testGetEncryptedKey() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        vm.prank(recipient1);
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getEncryptedKey(dataHash1);
        
        assertEq(keyInfo.encryptedKey, encryptedKey1);
        assertTrue(keyInfo.active);
    }
    
    function testUnauthorizedKeyAccess() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        vm.prank(unauthorized);
        vm.expectRevert("Key not active or access denied");
        keyManager.getEncryptedKey(dataHash1);
    }
    
    function testExpiredKeyAccess() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        vm.warp(block.timestamp + 3601);
        
        vm.prank(recipient1);
        vm.expectRevert("Key expired");
        keyManager.getEncryptedKey(dataHash1);
    }
    
    // Fuzz Tests
    function testFuzzKeyManagement(
        bytes32 dataHash, 
        address recipient, 
        bytes calldata encryptedKey,
        uint256 duration
    ) public {
        vm.assume(recipient != address(0));
        vm.assume(duration > 0 && duration < 365 days); // Reasonable duration
        
        keyManager.storeEncryptedKey(dataHash, recipient, encryptedKey, duration);
        
        vm.prank(recipient);
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getEncryptedKey(dataHash);
        
        assertEq(keyInfo.encryptedKey, encryptedKey);
        assertTrue(keyInfo.active);
    }
    
    function testKeyRecipientsList() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        keyManager.storeEncryptedKey(dataHash1, recipient2, encryptedKey2, 3600);
        
        address[] memory recipients = keyManager.getKeyRecipients(dataHash1);
        assertEq(recipients.length, 2);
        assertEq(recipients[0], recipient1);
        assertEq(recipients[1], recipient2);
    }

    // Additional edge case tests - Fixed
    function testStoreKeyForZeroAddress() public {
        vm.expectRevert("Invalid recipient address");
        keyManager.storeEncryptedKey(dataHash1, address(0), encryptedKey1, 3600);
    }

    function testRotateNonExistentKey() public {
        vm.expectRevert("No existing key");
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey1, 3600);
    }

    function testRevokeNonExistentKey() public {
        // This should not revert but also not change state meaningfully
        keyManager.revokeKey(dataHash1, recipient1);
        
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertFalse(keyInfo.active); // Should be false for non-existent key
        assertEq(keyInfo.creationTime, 0); // Should be uninitialized
    }

    function testKeyRotationSchedule() public {
        keyManager.setKeyRotationSchedule(dataHash1, 86400); // 1 day rotation
        
        // Verify the schedule was set
        assertEq(keyManager.keyRotationSchedule(dataHash1), 86400);
    }

    function testZeroDurationKey() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 0);
        
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertEq(keyInfo.expiryTime, block.timestamp); // Should expire immediately
    }

    function testNonAdminCannotGetKeyInfo() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        keyManager.getKeyInfo(dataHash1, recipient1);
    }

    function testMultipleKeysForSameRecipient() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        keyManager.storeEncryptedKey(dataHash2, recipient1, encryptedKey2, 7200);
        
        EncryptionKeyManagement.KeyInfo memory keyInfo1 = keyManager.getKeyInfo(dataHash1, recipient1);
        EncryptionKeyManagement.KeyInfo memory keyInfo2 = keyManager.getKeyInfo(dataHash2, recipient1);
        
        assertEq(keyInfo1.encryptedKey, encryptedKey1);
        assertEq(keyInfo2.encryptedKey, encryptedKey2);
        assertEq(keyInfo1.expiryTime, block.timestamp + 3600);
        assertEq(keyInfo2.expiryTime, block.timestamp + 7200);
    }

    // New Comprehensive Tests

    function testBulkKeyManagement() public {
        address[] memory recipients = new address[](5);
        bytes[] memory keys = new bytes[](5);
        
        for (uint i = 0; i < 5; i++) {
            recipients[i] = address(uint160(0x100 + i));
            keys[i] = abi.encodePacked("key_", i);
        }
        
        for (uint i = 0; i < recipients.length; i++) {
            keyManager.storeEncryptedKey(dataHash1, recipients[i], keys[i], 3600 * (i + 1));
        }
        
        // Verify all keys were stored
        address[] memory storedRecipients = keyManager.getKeyRecipients(dataHash1);
        assertEq(storedRecipients.length, 5);
        
        // Verify each key
        for (uint i = 0; i < recipients.length; i++) {
            EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHash1, recipients[i]);
            assertEq(keyInfo.encryptedKey, keys[i]);
            assertTrue(keyInfo.active);
            assertEq(keyInfo.expiryTime, block.timestamp + 3600 * (i + 1));
        }
    }

    function testKeyManagementGasOptimization() public {
        uint256 gasBefore = gasleft();
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        uint256 storeGas = gasBefore - gasleft();
        
        console.log("Store key gas used:", storeGas);
        
        gasBefore = gasleft();
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey2, 7200);
        uint256 rotateGas = gasBefore - gasleft();
        
        console.log("Rotate key gas used:", rotateGas);
        
        gasBefore = gasleft();
        keyManager.revokeKey(dataHash1, recipient1);
        uint256 revokeGas = gasBefore - gasleft();
        
        console.log("Revoke key gas used:", revokeGas);
        
        gasBefore = gasleft();
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        uint256 getInfoGas = gasBefore - gasleft();
        
        console.log("Get key info gas used:", getInfoGas);
        
        assertFalse(keyInfo.active);
        assertTrue(storeGas > 0);
        assertTrue(rotateGas > 0);
        assertTrue(revokeGas > 0);
        assertTrue(getInfoGas > 0);
    }

    function testRoleBasedAccessControl() public {
        address nonAdmin = address(0x5);
        
        // Non-admin cannot store keys
        vm.prank(nonAdmin);
        vm.expectRevert();
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        // Non-admin cannot rotate keys
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        vm.prank(nonAdmin);
        vm.expectRevert();
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey2, 7200);
        
        // Non-admin cannot revoke keys
        vm.prank(nonAdmin);
        vm.expectRevert();
        keyManager.revokeKey(dataHash1, recipient1);
        
        // Non-admin cannot set rotation schedule
        vm.prank(nonAdmin);
        vm.expectRevert();
        keyManager.setKeyRotationSchedule(dataHash1, 86400);
    }

    // Fixed: testKeyExpirationScenarios - Use safe duration instead of type(uint256).max
    function testKeyExpirationScenarios() public {
        // Test various expiration scenarios
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 1); // 1 second
        
        // Immediately after creation - should work
        vm.prank(recipient1);
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getEncryptedKey(dataHash1);
        assertEq(keyInfo.encryptedKey, encryptedKey1);
        
        // After expiration - should fail
        vm.warp(block.timestamp + 2);
        vm.prank(recipient1);
        vm.expectRevert("Key expired");
        keyManager.getEncryptedKey(dataHash1);
        
        // Test very long duration key (but safe from overflow)
        uint256 longDuration = 365 days * 10; // 10 years
        keyManager.storeEncryptedKey(dataHash2, recipient1, encryptedKey2, longDuration);
        
        // Far in the future - should still work
        vm.warp(block.timestamp + 365 days * 5); // 5 years later
        vm.prank(recipient1);
        keyInfo = keyManager.getEncryptedKey(dataHash2);
        assertEq(keyInfo.encryptedKey, encryptedKey2);
    }

    // Test arithmetic overflow protection
    function testArithmeticOverflowProtection() public {
        // Test that using max uint256 causes overflow (which should revert)
        vm.expectRevert(); // Expect any revert due to overflow
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, type(uint256).max);
    }

    function testKeyStateTransitions() public {
        // Test key lifecycle: active -> revoked -> rotated -> active
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        // Initial state: active
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertTrue(keyInfo.active);
        
        // Revoke: active -> inactive
        keyManager.revokeKey(dataHash1, recipient1);
        keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertFalse(keyInfo.active);
        
        // Rotate: should reactivate
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey2, 7200);
        keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertTrue(keyInfo.active);
        assertEq(keyInfo.encryptedKey, encryptedKey2);
    }

    function testMultipleDataHashes() public {
        bytes32[] memory dataHashes = new bytes32[](3);
        for (uint i = 0; i < 3; i++) {
            dataHashes[i] = keccak256(abi.encodePacked("dataset", i));
        }
        
        for (uint i = 0; i < dataHashes.length; i++) {
            keyManager.storeEncryptedKey(dataHashes[i], recipient1, encryptedKey1, 3600);
        }
        
        // Verify each data hash has its own key
        for (uint i = 0; i < dataHashes.length; i++) {
            EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHashes[i], recipient1);
            assertEq(keyInfo.encryptedKey, encryptedKey1);
            assertTrue(keyInfo.active);
        }
        
        // Verify rotation schedules can be set independently
        keyManager.setKeyRotationSchedule(dataHashes[0], 86400);
        keyManager.setKeyRotationSchedule(dataHashes[1], 172800);
        
        assertEq(keyManager.keyRotationSchedule(dataHashes[0]), 86400);
        assertEq(keyManager.keyRotationSchedule(dataHashes[1]), 172800);
        assertEq(keyManager.keyRotationSchedule(dataHashes[2]), 0); // Not set
    }

    function testEmergencyKeyRevocation() public {
        // Store keys for multiple recipients
        address[] memory recipients = new address[](4);
        for (uint i = 0; i < 4; i++) {
            recipients[i] = address(uint160(0x200 + i));
            keyManager.storeEncryptedKey(dataHash1, recipients[i], encryptedKey1, 86400);
        }
        
        // Emergency: revoke all keys
        for (uint i = 0; i < recipients.length; i++) {
            keyManager.revokeKey(dataHash1, recipients[i]);
        }
        
        // Verify no one can access keys
        for (uint i = 0; i < recipients.length; i++) {
            vm.prank(recipients[i]);
            vm.expectRevert("Key not active or access denied");
            keyManager.getEncryptedKey(dataHash1);
        }
    }

    // Fixed: testKeyRotationWithSchedule - Add time warp to ensure creation time changes
    function testKeyRotationWithSchedule() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        keyManager.setKeyRotationSchedule(dataHash1, 1800); // 30 minutes
        
        // Store initial creation time
        EncryptionKeyManagement.KeyInfo memory initialKey = keyManager.getKeyInfo(dataHash1, recipient1);
        uint256 initialCreationTime = initialKey.creationTime;
        
        // Move time forward to ensure creation time changes
        vm.warp(block.timestamp + 10);
        
        // Rotate key
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey2, 7200);
        
        EncryptionKeyManagement.KeyInfo memory rotatedKey = keyManager.getKeyInfo(dataHash1, recipient1);
        
        // Verify key was updated
        assertEq(rotatedKey.encryptedKey, encryptedKey2);
        assertEq(rotatedKey.expiryTime, block.timestamp + 7200);
        assertTrue(rotatedKey.creationTime > initialCreationTime, "Creation time should be updated");
    }

    function testFuzzEdgeCases(bytes32 dataHash, address recipient, uint256 duration) public {
        vm.assume(recipient != address(0));
        vm.assume(duration > 0 && duration < 365 days);
        
        // Test that valid inputs work without reverting
        keyManager.storeEncryptedKey(dataHash, recipient, encryptedKey1, duration);
        
        vm.prank(recipient);
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getEncryptedKey(dataHash);
        
        assertEq(keyInfo.encryptedKey, encryptedKey1);
        assertTrue(keyInfo.active);
    }

    function testKeyManagementEvents() public {
        // Test event emissions
        vm.recordLogs();
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        Vm.Log[] memory entries = vm.getRecordedLogs();
        assertEq(entries.length, 1, "KeyStored event should be emitted");
        
        vm.recordLogs();
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey2, 7200);
        entries = vm.getRecordedLogs();
        assertEq(entries.length, 1, "KeyRotated event should be emitted");
        
        vm.recordLogs();
        keyManager.revokeKey(dataHash1, recipient1);
        entries = vm.getRecordedLogs();
        assertEq(entries.length, 1, "KeyRevoked event should be emitted");
    }

    function testAdminHasProperRoles() public view {
        // Verify deployer has DEFAULT_ADMIN_ROLE
        assertTrue(keyManager.hasRole(keyManager.DEFAULT_ADMIN_ROLE(), admin));
    }

    function testKeyInfoForNonExistentData() public view {
        bytes32 nonExistentHash = keccak256(abi.encodePacked("non-existent"));
        
        // Should return default values for non-existent key
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(nonExistentHash, recipient1);
        assertFalse(keyInfo.active);
        assertEq(keyInfo.creationTime, 0);
        assertEq(keyInfo.expiryTime, 0);
        assertEq(keyInfo.encryptedKey.length, 0);
    }

    function testGetEncryptedKeyForNonExistentData() public {
        bytes32 nonExistentHash = keccak256(abi.encodePacked("non-existent"));
        
        vm.prank(recipient1);
        vm.expectRevert("Key not active or access denied");
        keyManager.getEncryptedKey(nonExistentHash);
    }

    // Additional tests for better coverage

    function testKeyRotationPreservesRecipientsList() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        keyManager.storeEncryptedKey(dataHash1, recipient2, encryptedKey2, 3600);
        
        // Verify initial recipients list
        address[] memory initialRecipients = keyManager.getKeyRecipients(dataHash1);
        assertEq(initialRecipients.length, 2);
        
        // Rotate key for one recipient
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey1, 7200);
        
        // Verify recipients list is preserved
        address[] memory finalRecipients = keyManager.getKeyRecipients(dataHash1);
        assertEq(finalRecipients.length, 2);
        assertEq(finalRecipients[0], recipient1);
        assertEq(finalRecipients[1], recipient2);
    }

    function testRevokeThenRotateKey() public {
        keyManager.storeEncryptedKey(dataHash1, recipient1, encryptedKey1, 3600);
        
        // Revoke key
        keyManager.revokeKey(dataHash1, recipient1);
        
        // Rotate should still work (reactivates the key)
        keyManager.rotateKey(dataHash1, recipient1, encryptedKey2, 7200);
        
        // Key should be active again
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getKeyInfo(dataHash1, recipient1);
        assertTrue(keyInfo.active);
        assertEq(keyInfo.encryptedKey, encryptedKey2);
        
        // Recipient should be able to access the new key
        vm.prank(recipient1);
        EncryptionKeyManagement.KeyInfo memory accessedKey = keyManager.getEncryptedKey(dataHash1);
        assertEq(accessedKey.encryptedKey, encryptedKey2);
    }
}