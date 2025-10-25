// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/**
 * @dev Minimal interface for Decentralized Identity
 */
interface IERC725 {
    function getData(bytes32 key) external view returns (bytes memory);
    function setData(bytes32 key, bytes memory value) external payable;
}