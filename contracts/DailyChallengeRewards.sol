// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract DailyChallengeRewards {
    address public owner;
    IERC20 public cUSD;

    mapping(address => uint256) public rewards;
    mapping(address => bool) public whitelist;

    event RewardSet(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event OwnershipTransferred(
        address indexed oldOwner,
        address indexed newOwner
    );
    event WhitelistUpdated(address indexed user, bool isWhitelisted);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    constructor(address _cUSD) {
        owner = msg.sender;
        cUSD = IERC20(_cUSD);
        whitelist[owner] = true;
    }

    /// Transfer contract ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        whitelist[newOwner] = true;
    }

    /// Add an address to the whitelist
    function addToWhitelist(address user) external onlyOwner {
        whitelist[user] = true;
        emit WhitelistUpdated(user, true);
    }

    /// Remove an address from the whitelist
    function removeFromWhitelist(address user) external onlyOwner {
        require(user != owner, "Cannot remove owner");
        whitelist[user] = false;
        emit WhitelistUpdated(user, false);
    }

    /// Check if an address is whitelisted
    function isWhitelisted(address user) external view returns (bool) {
        return whitelist[user];
    }

    /// Set multiple user rewards (only by whitelisted)
    function setRewards(
        address[] calldata users,
        uint256[] calldata amounts
    ) external onlyWhitelisted {
        require(users.length == amounts.length, "Mismatched inputs");
        for (uint256 i = 0; i < users.length; i++) {
            rewards[users[i]] += amounts[i];
            emit RewardSet(users[i], amounts[i]);
        }
    }

    /// Claim your reward
    function claimReward() external {
        uint256 amount = rewards[msg.sender];
        require(amount > 0, "No reward to claim");

        rewards[msg.sender] = 0;
        require(cUSD.transfer(msg.sender, amount), "Transfer failed");

        emit RewardClaimed(msg.sender, amount);
    }

    /// View the contract's cUSD balance
    function contractBalance() external view returns (uint256) {
        return cUSD.balanceOf(address(this));
    }

    /// Owner-only withdrawal (for safety/funding)
    function withdraw(uint256 amount) external onlyOwner {
        require(cUSD.transfer(owner, amount), "Withdraw failed");
    }

    /// Get a user's reward
    function getUserReward(address user) external view returns (uint256) {
        return rewards[user];
    }
}
