// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MintCoin.sol";

contract CoinFactory is Ownable {
    uint256 public deployFee;
    address public feeRecipient;

    event CoinCreated(address indexed coin, address indexed owner, string name, string symbol);
    event DeployFeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);

    constructor(uint256 deployFee_, address feeRecipient_) Ownable(msg.sender) {
        deployFee = deployFee_;
        feeRecipient = feeRecipient_;
    }

    function setDeployFee(uint256 newFee) external onlyOwner {
        deployFee = newFee;
        emit DeployFeeUpdated(newFee);
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "INVALID_RECIPIENT");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    function createCoin(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_,
        uint256 cap_
    ) external payable returns (address) {
        require(msg.value == deployFee, "INVALID_FEE");
        require(owner_ != address(0), "INVALID_OWNER");

        MintCoin coin = new MintCoin(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            owner_,
            cap_
        );

        (bool sent, ) = feeRecipient.call{value: msg.value}(""");
        require(sent, "FEE_TRANSFER_FAILED");

        emit CoinCreated(address(coin), owner_, name_, symbol_);
        return address(coin);
    }
}
