// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/token/ERC721/ERC721.sol";
import "@openzeppelin/access/AccessControl.sol";

/**
 * @author Nworah Chimzuruoke Gabriel (SAGGIO)
 * @title Data Tokenization & Traceability Contract
 * @notice Represents datasets as non-transferable Soulbound NFTs
 */
contract DataTokenization is ERC721, AccessControl {
    bytes32 public constant TRANSFER_APPROVER_ROLE = keccak256("TRANSFER_APPROVER_ROLE");
    
    uint256 private _tokenIdCounter;
    
    struct TokenMetadata {
        bytes32 dataHash;
        string metadataURI;
        uint256 creationTime;
        address originalOwner;
    }
    
    mapping(uint256 => TokenMetadata) public tokenMetadata;
    mapping(bytes32 => uint256) public dataHashToTokenId;
    
    // Soulbound NFT - transfers disabled by default
    bool public transfersEnabled = false;
    
    // Events
    event DataTokenized(
        uint256 indexed tokenId,
        bytes32 indexed dataHash,
        address indexed owner,
        string metadataURI,
        uint256 timestamp
    );
    
    event TransferApproved(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        address approver
    );
    
    constructor() ERC721("DataToken", "DTKN") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TRANSFER_APPROVER_ROLE, msg.sender);
    }
    
    /**
     * @dev Tokenize a dataset as Soulbound NFT
     * @param dataHash The data hash
     * @param metadataURI The metadata URI
     * @param owner The owner address
     */
    function tokenizeData(
        bytes32 dataHash,
        string calldata metadataURI,
        address owner
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256) {
        require(dataHashToTokenId[dataHash] == 0, "Data already tokenized");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _mint(owner, tokenId);
        
        tokenMetadata[tokenId] = TokenMetadata({
            dataHash: dataHash,
            metadataURI: metadataURI,
            creationTime: block.timestamp,
            originalOwner: owner
        });
        
        dataHashToTokenId[dataHash] = tokenId;
        
        emit DataTokenized(tokenId, dataHash, owner, metadataURI, block.timestamp);
        
        return tokenId;
    }
    
    /**
     * @dev Override transfer to enforce Soulbound nature
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting and burning, but restrict transfers
        if (from != address(0) && to != address(0)) {
            require(
                transfersEnabled || hasRole(TRANSFER_APPROVER_ROLE, msg.sender),
                "Transfers disabled: Soulbound token"
            );
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Enable/disable transfers (admin only)
     * @param enabled Whether transfers are enabled
     */
    function setTransfersEnabled(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        transfersEnabled = enabled;
    }
    
    /**
     * @dev Approve and execute transfer (for approved transfers only)
     * @param from Current owner
     * @param to New owner
     * @param tokenId The token ID
     */
    function approveAndTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external onlyRole(TRANSFER_APPROVER_ROLE) {
        require(ownerOf(tokenId) == from, "Not token owner");
        
        // Perform the transfer
        _transfer(from, to, tokenId);
        
        emit TransferApproved(tokenId, from, to, msg.sender);
    }
    
    /**
     * @dev Get token metadata
     * @param tokenId The token ID
     */
    function getTokenMetadata(
        uint256 tokenId
    ) external view returns (TokenMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenMetadata[tokenId];
    }
    
    /**
     * @dev Check if data is tokenized
     * @param dataHash The data hash
     */
    function isDataTokenized(bytes32 dataHash) external view returns (bool) {
        return dataHashToTokenId[dataHash] != 0;
    }
    
    /**
     * @dev Check if token exists (compatibility helper)
     * @param tokenId The token ID
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}