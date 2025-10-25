// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/access/AccessControl.sol";

/**
 * @author Nworah Chimzuruoke Gabriel
 * @title Encryption Key Management Contract
 * @notice Manages encrypted access keys with rotation and authorization
 */
contract EncryptionKeyManagement is AccessControl {
    struct KeyInfo {
        bytes encryptedKey; // Key encrypted with recipient's public key
        uint256 creationTime;
        uint256 expiryTime;
        bool active;
    }

    mapping(bytes32 => mapping(address => KeyInfo)) public userKeys;
    mapping(bytes32 => address[]) public keyRecipients;
    mapping(bytes32 => uint256) public keyRotationSchedule;

    // Events
    event KeyStored(
        bytes32 indexed dataHash,
        address indexed recipient,
        uint256 creationTime,
        uint256 expiryTime
    );

    event KeyRotated(
        bytes32 indexed dataHash,
        address indexed recipient,
        uint256 rotationTime
    );

    event KeyRevoked(
        bytes32 indexed dataHash,
        address indexed recipient,
        uint256 revocationTime
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Store encrypted key for a recipient
     * @param dataHash The data hash
     * @param recipient The recipient address
     * @param encryptedKey The encrypted key bytes
     * @param validityDuration Key validity duration
     */
    function storeEncryptedKey(
        bytes32 dataHash,
        address recipient,
        bytes calldata encryptedKey,
        uint256 validityDuration
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(recipient != address(0), "Invalid recipient address");

        uint256 expiryTime = block.timestamp + validityDuration;

        // Add to recipients list if new
        if (userKeys[dataHash][recipient].creationTime == 0) {
            keyRecipients[dataHash].push(recipient);
        }

        userKeys[dataHash][recipient] = KeyInfo({
            encryptedKey: encryptedKey,
            creationTime: block.timestamp,
            expiryTime: expiryTime,
            active: true
        });

        emit KeyStored(dataHash, recipient, block.timestamp, expiryTime);
    }

    /**
     * @dev Rotate key for a recipient
     * @param dataHash The data hash
     * @param recipient The recipient address
     * @param newEncryptedKey The new encrypted key
     * @param validityDuration New validity duration
     */
    function rotateKey(
        bytes32 dataHash,
        address recipient,
        bytes calldata newEncryptedKey,
        uint256 validityDuration
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            userKeys[dataHash][recipient].creationTime > 0,
            "No existing key"
        );

        uint256 expiryTime = block.timestamp + validityDuration;

        userKeys[dataHash][recipient] = KeyInfo({
            encryptedKey: newEncryptedKey,
            creationTime: block.timestamp,
            expiryTime: expiryTime,
            active: true
        });

        emit KeyRotated(dataHash, recipient, block.timestamp);
    }

    /**
     * @dev Revoke key for a recipient
     * @param dataHash The data hash
     * @param recipient The recipient address
     */
    function revokeKey(
        bytes32 dataHash,
        address recipient
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        userKeys[dataHash][recipient].active = false;
        emit KeyRevoked(dataHash, recipient, block.timestamp);
    }

    /**
     * @dev Get encrypted key (authorized access only)
     * @param dataHash The data hash
     */
    function getEncryptedKey(
        bytes32 dataHash
    ) external view returns (KeyInfo memory) {
        KeyInfo memory keyInfo = userKeys[dataHash][msg.sender];
        require(keyInfo.active, "Key not active or access denied");
        require(block.timestamp <= keyInfo.expiryTime, "Key expired");
        return keyInfo;
    }

    /**
     * @dev Get key info for any user (admin only)
     * @param dataHash The data hash
     * @param recipient The recipient address
     */
    function getKeyInfo(
        bytes32 dataHash,
        address recipient
    ) external view onlyRole(DEFAULT_ADMIN_ROLE) returns (KeyInfo memory) {
        return userKeys[dataHash][recipient];
    }

    /**
     * @dev Set key rotation schedule
     * @param dataHash The data hash
     * @param rotationPeriod Rotation period in seconds
     */
    function setKeyRotationSchedule(
        bytes32 dataHash,
        uint256 rotationPeriod
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        keyRotationSchedule[dataHash] = rotationPeriod;
    }

    /**
     * @dev Get all key recipients for specific data
     * @param dataHash The data hash
     */
    function getKeyRecipients(
        bytes32 dataHash
    ) external view returns (address[] memory) {
        return keyRecipients[dataHash];
    }
}
