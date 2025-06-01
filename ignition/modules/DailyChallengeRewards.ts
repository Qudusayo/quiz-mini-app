import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DailyChallengeRewards", (m) => {
    // The cUSD token address on the network
    // This should be replaced with the actual cUSD token address for the target network
    const cUSDAddress = "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F"; // Example: cEUR on Celo Alfajores

    // Deploy the DailyChallengeRewards contract
    const dailyChallengeRewards = m.contract("DailyChallengeRewards", [cUSDAddress]);

    return { dailyChallengeRewards };
});
