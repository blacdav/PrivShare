// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @author Nworah Chimzuruoke Gabriel (SAGGIO)
 * @title Data Ownership & Registration Contract
 * @notice Defines and records rightful ownership of datasets with version control
 */
contract DataOwnershipRegistry {
    // Core mappings for data ownership and versioning
    mapping(bytes32 => address) public dataOwner;
    mapping(bytes32 => uint256) public dataVersion;
    mapping(bytes32 => bytes32) public previousVersion;
    
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
    
    // Modifier to check ownership
    modifier onlyOwner(bytes32 dataHash) {
        require(dataOwner[dataHash] == msg.sender, "Current Interactor is not data owner");
        _;
    }
    
    /**
     * @dev Register a new dataset
     * @param dataHash The hash of the dataset
     * @param encryptionMethod The encryption method used
     */
    function registerData(
        bytes32 dataHash,
        string calldata encryptionMethod
    ) external {
        require(dataOwner[dataHash] == address(0), "Data already registered");
        require(dataHash != bytes32(0), "Invalid data hash");
        
        dataOwner[dataHash] = msg.sender;
        dataVersion[dataHash] = 1;
        
        emit DataRegistered(
            dataHash,
            msg.sender,
            block.timestamp,
            encryptionMethod,
            1
        );
    }
    
    /**
     * @dev Create a new version of existing data
     * @param oldDataHash The previous version's hash
     * @param newDataHash The new version's hash
     * @param encryptionMethod The encryption method for new version
     */
    function createNewVersion(
        bytes32 oldDataHash,
        bytes32 newDataHash,
        string calldata encryptionMethod
    ) external onlyOwner(oldDataHash) {
        require(dataOwner[newDataHash] == address(0), "New hash already registered");
        require(newDataHash != bytes32(0), "Invalid new data hash");
        
        uint256 newVersion = dataVersion[oldDataHash] + 1;
        
        dataOwner[newDataHash] = msg.sender;
        dataVersion[newDataHash] = newVersion;
        previousVersion[newDataHash] = oldDataHash;
        
        emit DataVersionUpdated(
            oldDataHash,
            newDataHash,
            msg.sender,
            newVersion,
            block.timestamp
        );
        
        emit DataRegistered(
            newDataHash,
            msg.sender,
            block.timestamp,
            encryptionMethod,
            newVersion
        );
    }
    
    /**
     * @dev Verify data existence and ownership (Proof-of-Existence)
     * @param dataHash The hash to verify
     * @param allegedOwner The alleged owner address
     */
    function verifyOwnership(
        bytes32 dataHash,
        address allegedOwner
    ) external view returns (bool) {
        return dataOwner[dataHash] == allegedOwner && dataOwner[dataHash] != address(0);
    }
    
    /**
     * @dev Get data version history
     * @param dataHash The current data hash
     */
    function getVersionHistory(
        bytes32 dataHash
    ) external view returns (bytes32[] memory) {
        bytes32[] memory history = new bytes32[](dataVersion[dataHash]);
        bytes32 currentHash = dataHash;
        
        for (uint256 i = dataVersion[dataHash]; i > 0; i--) {
            history[i - 1] = currentHash;
            currentHash = previousVersion[currentHash];
            if (currentHash == bytes32(0)) break;
        }
        
        return history;
    }
}