import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DailyChallengeRewards", (m) => {
    // The cUSD token address on the network
    // This should be replaced with the actual cUSD token address for the target network
    const cUSDAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Example: cUSD on Celo Mainnet

    // Deploy the DailyChallengeRewards contract
    const dailyChallengeRewards = m.contract("DailyChallengeRewards", [cUSDAddress]);

    return { dailyChallengeRewards };
});
