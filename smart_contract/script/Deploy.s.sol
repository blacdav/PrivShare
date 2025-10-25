// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@forge-std/Script.sol";
import "@contract/DataOwnershipRegistry.sol";
import "@contract/AccessControlPermission.sol";
import "@contract/EncryptionKeyManagement.sol";
import "@contract/DataTokenization.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        DataOwnershipRegistry registry = new DataOwnershipRegistry();
        AccessControlPermission accessControl = new AccessControlPermission();
        EncryptionKeyManagement keyManagement = new EncryptionKeyManagement();
        DataTokenization tokenization = new DataTokenization();
        
        console.log("DataOwnershipRegistry deployed at:", address(registry));
        console.log("AccessControlPermission deployed at:", address(accessControl));
        console.log("EncryptionKeyManagement deployed at:", address(keyManagement));
        console.log("DataTokenization deployed at:", address(tokenization));
        
        vm.stopBroadcast();
    }
}