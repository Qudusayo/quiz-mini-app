import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Button from "./button";
import contractABI from "../abi.json";
import Alert from "./alert";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function ClaimReward({ isEligible }: { isEligible: boolean }) {
  const { writeContract, isPending, data: hash, error } = useWriteContract();

  const handleClaim = async () => {
    if (!isEligible) return;

    writeContract({
      abi: contractABI,
      address: CONTRACT_ADDRESS as `0x${string}`,
      functionName: "claimReward",
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  return (
    <div className="relative w-full">
      <Alert
        isCorrect={!error && isConfirmed}
        showAlert={!!error || isConfirmed}
        alertText={isConfirmed ? "Reward claimed!" : "Error claiming reward"}
      />
      <Button
        className="lg:w-3/5 w-4/5 mx-auto block text-xl font-semibold uppercase z-10 py-6"
        disabled={!isEligible || isPending || isConfirming}
        onClick={handleClaim}
      >
        {isPending || isConfirming ? "Claiming..." : "Claim Reward"}
      </Button>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-[2px] bg-white"></div>
      </div>
    </div>
  );
}
