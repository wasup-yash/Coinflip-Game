// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Coinflip is Ownable {
    IERC20 public token;

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function flip(uint256 _amount, bool _choice) external {
        require(token.balanceOf(msg.sender) >= _amount, "Not enough tokens");

        // Simulate coin flip (simple randomness for example purposes)
        bool result = (block.timestamp % 2 == 0);

        if (_choice == result) {
            // Win: Double the tokens
            token.transfer(msg.sender, _amount * 2);
        } else {
            // Lose: Deduct the tokens
            token.transferFrom(msg.sender, address(this), _amount);
        }
    }
}
