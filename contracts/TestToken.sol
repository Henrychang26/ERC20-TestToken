// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract TestToken is ERC20Capped, ERC20Burnable {
    //Token Design:
    //1. Initial Supply (send to owner) - 70% to owner (70,000,000)
    //2. Max Supply(capped) => 100,00,000
    //3. Make token burnable.
    //4. Create block reward to distribute new supply to miners

    //State Variables
    address payable public owner;
    uint256 public blockReward;

    //Modifier

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    //Constructor
    constructor (uint256 cap, uint256 reward) ERC20("TestToken", "TTC") ERC20Capped(cap * (10 ** decimals())){
        owner = payable(msg.sender);
        _mint(owner, 70000000 * (10 ** decimals()));
        blockReward = reward * (10 ** decimals());
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20Capped, ERC20) {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

    function _beforeTokenTransfer(address from, address to , uint256 value) internal virtual override{
        if(from != address(0) && to != block.coinbase && block.coinbase != address(0)){  //address(0) makes sure its a valid address
            _mintMinerReward();
        }
        super._beforeTokenTransfer(from, to , value);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function destroy() public onlyOwner{
        selfdestruct(owner);
    }

    function setBlockReward (uint256 reward) public onlyOwner{
        blockReward = reward * (10 ** decimals());
    }
    
}