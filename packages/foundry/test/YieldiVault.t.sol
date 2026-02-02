// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/YieldiVault.sol";

contract YieldiVaultTest is Test {
    YieldiVault public instance;
    address public owner;
    address public user1;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        instance = new YieldiVault();
    }

    function testDeployment() public view {
        assertTrue(address(instance) != address(0), "Contract should be deployed");
    }

    function testOwner() public view {
        assertEq(instance.owner(), owner, "Owner should be deployer");
    }

    function testUnauthorizedAccess() public {
        vm.prank(user1);
        vm.expectRevert("YieldiVault: caller is not the owner");
        // Attempt to call owner-only function
        instance.emergencyWithdraw(1 ether);
    }
}