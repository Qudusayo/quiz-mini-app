import { useWriteContract } from "wagmi";
import Button from "./button";
import contractABI from "../abi.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function ClaimReward({ isEligible }: { isEligible: boolean }) {
  const { writeContractAsync } = useWriteContract();

  const handleClaim = async () => {
    if (!isEligible) return;

    const tx = await writeContractAsync({
      abi: contractABI,
      address: CONTRACT_ADDRESS as `0x${string}`,
      functionName: "claimReward",
    });

    console.log("Claimed reward", tx);
  };

  return (
    <div className="relative w-full">
      <Button
        className="lg:w-3/5 w-4/5 mx-auto block text-xl font-semibold uppercase z-10 py-6"
        disabled={!isEligible}
        onClick={handleClaim}
      >
        Claim Reward
      </Button>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-[2px] bg-white"></div>
      </div>
    </div>
  );
}
