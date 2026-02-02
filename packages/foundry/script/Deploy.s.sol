// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/YieldiVault.sol";

/**
 * @notice Deploy script for YieldiVault
 * @dev Run with: forge script script/Deploy.s.sol --rpc-url <rpc_url> --broadcast
 */
contract DeployScript is Script {
    function run() external returns (YieldiVault) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        YieldiVault instance = new YieldiVault();
        
        vm.stopBroadcast();
        
        console.log("YieldiVault deployed at:", address(instance));
        
        return instance;
    }
}
