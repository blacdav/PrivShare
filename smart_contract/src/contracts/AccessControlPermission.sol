// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/access/AccessControl.sol";

/**
 * @author Nworah Chimzuruoke Gabriel (SAGGIO)
 * @title Access Control & Permission Contract
 * @notice Enforces fine-grained access rules with time-limited tokens
 */
contract AccessControlPermission is AccessControl {
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    struct AccessGrant {
        bool granted;
        uint256 expiry;
        uint256 grantTime;
    }
    
    // Core access control mappings
    mapping(bytes32 => mapping(address => AccessGrant)) public accessGrants;
    mapping(bytes32 => address[]) public dataAccessList;
    mapping(bytes32 => bool) public multiSigRequired;
    mapping(bytes32 => mapping(address => bool)) public multiSigApprovals;
    
    // Events for immutable audit trail
    event AccessGranted(
        bytes32 indexed dataHash,
        address indexed user,
        uint256 expiry,
        uint256 timestamp
    );
    
    event AccessRevoked(
        bytes32 indexed dataHash,
        address indexed user,
        uint256 timestamp
    );
    
    event MultiSigRequiredUpdated(
        bytes32 indexed dataHash,
        bool required
    );
    
    event MultiSigApprovalGranted(
        bytes32 indexed dataHash,
        address indexed approver,
        address indexed targetUser
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Grant access to a user with optional time limit
     * @param dataHash The data hash to grant access to
     * @param user The user address to grant access
     * @param durationInSeconds Access duration
     */
    function grantAccess(
        bytes32 dataHash,
        address user,
        uint256 durationInSeconds
    ) external onlyRole(ADMIN_ROLE) {
        uint256 expiry = durationInSeconds > 0 ? block.timestamp + durationInSeconds : type(uint256).max;
        
        // Initialize if first access
        if (!accessGrants[dataHash][user].granted) {
            dataAccessList[dataHash].push(user);
        }
        
        accessGrants[dataHash][user] = AccessGrant({
            granted: true,
            expiry: expiry,
            grantTime: block.timestamp
        });
        
        emit AccessGranted(dataHash, user, expiry, block.timestamp);
    }
    
    /**
     * @dev Revoke access from a user
     * @param dataHash The data hash to revoke access from
     * @param user The user address to revoke access
     */
    function revokeAccess(
        bytes32 dataHash,
        address user
    ) external onlyRole(ADMIN_ROLE) {
        accessGrants[dataHash][user].granted = false;
        emit AccessRevoked(dataHash, user, block.timestamp);
    }
    
    /**
     * @dev Check if a user has valid access
     * @param dataHash The data hash to check
     * @param user The user address to check
     */
    function hasAccess(
        bytes32 dataHash,
        address user
    ) public view returns (bool) {
        AccessGrant memory grant = accessGrants[dataHash][user];
        return grant.granted && block.timestamp <= grant.expiry;
    }
    
    /**
     * @dev Enable/disable multi-signature requirement for data access
     * @param dataHash The data hash to configure
     * @param required Whether multi-sig is required
     */
    function setMultiSigRequirement(
        bytes32 dataHash,
        bool required
    ) external onlyRole(ADMIN_ROLE) {
        multiSigRequired[dataHash] = required;
        emit MultiSigRequiredUpdated(dataHash, required);
    }
    
    /**
     * @dev Grant multi-signature approval for access
     * @param dataHash The data hash
     * @param targetUser The user being approved for access
     */
    function grantMultiSigApproval(
        bytes32 dataHash,
        address targetUser
    ) external onlyRole(ADMIN_ROLE) {
        multiSigApprovals[dataHash][targetUser] = true;
        emit MultiSigApprovalGranted(dataHash, msg.sender, targetUser);
    }
    
    /**
     * @dev Get all users with access to specific data
     * @param dataHash The data hash
     */
    function getDataAccessList(
        bytes32 dataHash
    ) external view returns (address[] memory) {
        return dataAccessList[dataHash];
    }
}