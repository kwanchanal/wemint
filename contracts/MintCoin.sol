// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintCoin is ERC20, ERC20Burnable, Pausable, Ownable {
    uint8 private immutable _coinDecimals;
    uint256 public immutable cap;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        uint256 cap_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        _coinDecimals = decimals_;
        cap = cap_;

        if (initialSupply_ > 0) {
            _mint(owner_, initialSupply_);
        }
    }

    function decimals() public view override returns (uint8) {
        return _coinDecimals;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function _mint(address account, uint256 amount) internal override {
        if (cap > 0) {
            require(totalSupply() + amount <= cap, "CAP_EXCEEDED");
        }
        super._mint(account, amount);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20) whenNotPaused {
        super._update(from, to, value);
    }
}
