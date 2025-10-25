// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@forge-std/Test.sol";
import "@contract/DataOwnershipRegistry.sol";
import "@contract/AccessControlPermission.sol";
import "@contract/EncryptionKeyManagement.sol";
import "@contract/DataTokenization.sol";

contract IntegrationTest is Test {
    DataOwnershipRegistry public registry;
    AccessControlPermission public accessControl;
    EncryptionKeyManagement public keyManager;
    DataTokenization public tokenization;

    address admin = address(0x1);
    address dataOwner = address(0x2);
    address dataUser = address(0x3);
    address auditor = address(0x4);

    bytes32 dataHash = keccak256(abi.encodePacked("sensitive_data"));
    bytes encryptedKey = "encrypted_key_data";

    function setUp() public {
        vm.startPrank(admin);
        registry = new DataOwnershipRegistry();
        accessControl = new AccessControlPermission();
        keyManager = new EncryptionKeyManagement();
        tokenization = new DataTokenization();
        vm.stopPrank();
    }

    function testCompleteDataLifecycle() public {
        // 1. Register data ownership
        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256-GCM");

        // 2. Tokenize the data
        vm.prank(admin);
        uint256 tokenId = tokenization.tokenizeData(
            dataHash,
            "ipfs://metadata",
            dataOwner
        );

        // 3. Grant access to user
        vm.prank(admin);
        accessControl.grantAccess(dataHash, dataUser, 86400); // 24 hours

        // 4. Store encrypted key for user
        vm.prank(admin);
        keyManager.storeEncryptedKey(dataHash, dataUser, encryptedKey, 86400);

        // Verify integration
        assertTrue(registry.verifyOwnership(dataHash, dataOwner));
        assertTrue(accessControl.hasAccess(dataHash, dataUser));
        assertTrue(tokenization.exists(tokenId));

        // User can retrieve their encrypted key
        vm.prank(dataUser);
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager
            .getEncryptedKey(dataHash);
        assertEq(keyInfo.encryptedKey, encryptedKey);
    }

    function testAccessRevocationFlow() public {
        // Setup
        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        vm.prank(admin);
        accessControl.grantAccess(dataHash, dataUser, 86400);

        vm.prank(admin);
        keyManager.storeEncryptedKey(dataHash, dataUser, encryptedKey, 86400);

        // Verify initial access
        assertTrue(accessControl.hasAccess(dataHash, dataUser));

        // Revoke access in both systems
        vm.prank(admin);
        accessControl.revokeAccess(dataHash, dataUser);
        
        vm.prank(admin);
        keyManager.revokeKey(dataHash, dataUser);

        // Verify access is revoked
        assertFalse(accessControl.hasAccess(dataHash, dataUser));

        // User can no longer retrieve key
        vm.prank(dataUser);
        vm.expectRevert("Key not active or access denied");
        keyManager.getEncryptedKey(dataHash);
    }

    function testMultiContractInteraction() public {
        // Test interaction between all contracts without prank conflicts
        vm.prank(dataOwner);
        registry.registerData(dataHash, "ChaCha20");

        vm.prank(admin);
        uint256 tokenId = tokenization.tokenizeData(
            dataHash,
            "ipfs://QmTest",
            dataOwner
        );

        // Access control setup
        vm.prank(admin);
        accessControl.grantAccess(dataHash, dataUser, 3600);
        
        vm.prank(admin);
        keyManager.storeEncryptedKey(dataHash, dataUser, encryptedKey, 3600);

        // Verify all systems are synchronized
        assertEq(registry.dataOwner(dataHash), dataOwner);
        assertEq(tokenization.ownerOf(tokenId), dataOwner);
        assertTrue(accessControl.hasAccess(dataHash, dataUser));
    }

    // New Integration Tests

    function testDataVersioningWithAccessControl() public {
        // Register initial data
        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        // Grant access to user
        vm.prank(admin);
        accessControl.grantAccess(dataHash, dataUser, 86400);

        // Create new version
        bytes32 newDataHash = keccak256(abi.encodePacked("sensitive_data_v2"));
        vm.prank(dataOwner);
        registry.createNewVersion(dataHash, newDataHash, "AES-256-GCM");

        // Grant access to new version
        vm.prank(admin);
        accessControl.grantAccess(newDataHash, dataUser, 86400);

        // Verify both versions have proper access
        assertTrue(accessControl.hasAccess(dataHash, dataUser));
        assertTrue(accessControl.hasAccess(newDataHash, dataUser));
        
        // Verify version history
        bytes32[] memory history = registry.getVersionHistory(newDataHash);
        assertEq(history.length, 2);
        assertEq(history[0], dataHash);
        assertEq(history[1], newDataHash);
    }

    function testTimeBasedAccessExpiration() public {
        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        vm.prank(admin);
        accessControl.grantAccess(dataHash, dataUser, 3600); // 1 hour

        vm.prank(admin);
        keyManager.storeEncryptedKey(dataHash, dataUser, encryptedKey, 3600);

        // Verify initial access
        assertTrue(accessControl.hasAccess(dataHash, dataUser));

        // Fast forward past expiry
        vm.warp(block.timestamp + 3601);

        // Verify access expired
        assertFalse(accessControl.hasAccess(dataHash, dataUser));

        // Key should also be expired
        vm.prank(dataUser);
        vm.expectRevert("Key expired");
        keyManager.getEncryptedKey(dataHash);
    }

    function testTokenTransferWithConsent() public {
        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        vm.prank(admin);
        uint256 tokenId = tokenization.tokenizeData(dataHash, "ipfs://metadata", dataOwner);

        // Try to transfer without approval - should fail (Soulbound)
        vm.prank(dataOwner);
        vm.expectRevert("Transfers disabled: Soulbound token");
        tokenization.transferFrom(dataOwner, dataUser, tokenId);

        // Enable transfers and transfer
        vm.prank(admin);
        tokenization.setTransfersEnabled(true);

        vm.prank(dataOwner);
        tokenization.transferFrom(dataOwner, dataUser, tokenId);

        // Verify new ownership
        assertEq(tokenization.ownerOf(tokenId), dataUser);
    }

    function testMultiUserAccessManagement() public {
        address user2 = address(0x5);
        address user3 = address(0x6);

        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        // Grant access to multiple users
        vm.startPrank(admin);
        accessControl.grantAccess(dataHash, dataUser, 3600);
        accessControl.grantAccess(dataHash, user2, 7200);
        accessControl.grantAccess(dataHash, user3, 10800);
        
        keyManager.storeEncryptedKey(dataHash, dataUser, encryptedKey, 3600);
        keyManager.storeEncryptedKey(dataHash, user2, "key2", 7200);
        keyManager.storeEncryptedKey(dataHash, user3, "key3", 10800);
        vm.stopPrank();

        // Verify all users have access
        assertTrue(accessControl.hasAccess(dataHash, dataUser));
        assertTrue(accessControl.hasAccess(dataHash, user2));
        assertTrue(accessControl.hasAccess(dataHash, user3));

        // Verify access list
        address[] memory accessList = accessControl.getDataAccessList(dataHash);
        assertEq(accessList.length, 3);

        // Verify key recipients list
        address[] memory keyRecipients = keyManager.getKeyRecipients(dataHash);
        assertEq(keyRecipients.length, 3);
    }

    function testKeyRotationWorkflow() public {
        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        vm.prank(admin);
        accessControl.grantAccess(dataHash, dataUser, 86400);

        // Store initial key
        vm.prank(admin);
        keyManager.storeEncryptedKey(dataHash, dataUser, encryptedKey, 86400);

        // Rotate key
        bytes memory newEncryptedKey = "new_encrypted_key_data";
        vm.prank(admin);
        keyManager.rotateKey(dataHash, dataUser, newEncryptedKey, 172800); // 2 days

        // User can retrieve new key
        vm.prank(dataUser);
        EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getEncryptedKey(dataHash);
        assertEq(keyInfo.encryptedKey, newEncryptedKey);
        assertEq(keyInfo.expiryTime, block.timestamp + 172800);
    }

    function testEmergencyAccessRevocation() public {
        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        // Grant access to multiple users
        address[] memory users = new address[](3);
        users[0] = dataUser;
        users[1] = address(0x5);
        users[2] = address(0x6);

        vm.startPrank(admin);
        for (uint i = 0; i < users.length; i++) {
            accessControl.grantAccess(dataHash, users[i], 86400);
            keyManager.storeEncryptedKey(dataHash, users[i], encryptedKey, 86400);
        }
        vm.stopPrank();

        // Emergency: revoke all access
        vm.startPrank(admin);
        for (uint i = 0; i < users.length; i++) {
            accessControl.revokeAccess(dataHash, users[i]);
            keyManager.revokeKey(dataHash, users[i]);
        }
        vm.stopPrank();

        // Verify no one has access
        for (uint i = 0; i < users.length; i++) {
            assertFalse(accessControl.hasAccess(dataHash, users[i]));
            
            vm.prank(users[i]);
            vm.expectRevert("Key not active or access denied");
            keyManager.getEncryptedKey(dataHash);
        }
    }

    function testDataTokenizationAndOwnershipSync() public {
        // Register data
        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        // Tokenize data
        vm.prank(admin);
        uint256 tokenId = tokenization.tokenizeData(dataHash, "ipfs://metadata", dataOwner);

        // Verify synchronization
        assertTrue(registry.verifyOwnership(dataHash, dataOwner));
        assertEq(tokenization.ownerOf(tokenId), dataOwner);

        // Get token metadata
        DataTokenization.TokenMetadata memory metadata = tokenization.getTokenMetadata(tokenId);
        assertEq(metadata.dataHash, dataHash);
        assertEq(metadata.originalOwner, dataOwner);

        // Verify data is tokenized
        assertTrue(tokenization.isDataTokenized(dataHash));
        assertEq(tokenization.dataHashToTokenId(dataHash), tokenId);
    }

    function testComplexWorkflowWithMultipleDataHashes() public {
        bytes32[] memory dataHashes = new bytes32[](3);
        dataHashes[0] = keccak256(abi.encodePacked("data1"));
        dataHashes[1] = keccak256(abi.encodePacked("data2"));
        dataHashes[2] = keccak256(abi.encodePacked("data3"));

        // Register all data
        for (uint i = 0; i < dataHashes.length; i++) {
            vm.prank(dataOwner);
            registry.registerData(dataHashes[i], "AES-256");
        }

        // Grant access to all data for user
        vm.startPrank(admin);
        for (uint i = 0; i < dataHashes.length; i++) {
            accessControl.grantAccess(dataHashes[i], dataUser, 86400);
            keyManager.storeEncryptedKey(dataHashes[i], dataUser, encryptedKey, 86400);
        }
        vm.stopPrank();

        // Verify access to all data
        for (uint i = 0; i < dataHashes.length; i++) {
            assertTrue(accessControl.hasAccess(dataHashes[i], dataUser));
            
            vm.prank(dataUser);
            EncryptionKeyManagement.KeyInfo memory keyInfo = keyManager.getEncryptedKey(dataHashes[i]);
            assertEq(keyInfo.encryptedKey, encryptedKey);
        }
    }

    function testAccessControlWithRoleManagement() public {
        // Test that only admins can perform certain actions
        address nonAdmin = address(0x7);

        vm.prank(dataOwner);
        registry.registerData(dataHash, "AES-256");

        // Non-admin cannot grant access
        vm.prank(nonAdmin);
        vm.expectRevert();
        accessControl.grantAccess(dataHash, dataUser, 3600);

        // Non-admin cannot revoke access
        vm.prank(admin);
        accessControl.grantAccess(dataHash, dataUser, 3600);

        vm.prank(nonAdmin);
        vm.expectRevert();
        accessControl.revokeAccess(dataHash, dataUser);

        // Non-admin cannot manage keys
        vm.prank(nonAdmin);
        vm.expectRevert();
        keyManager.storeEncryptedKey(dataHash, dataUser, encryptedKey, 3600);
    }
}