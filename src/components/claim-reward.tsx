import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Button from "./button";
import contractABI from "../abi.json";
import Alert from "./alert";
import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function ClaimReward({
  isEligible,
  onRefresh,
}: {
  isEligible: boolean;
  onRefresh?: () => void;
}) {
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  const [showAlert, setShowAlert] = useState(false);

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

  useEffect(() => {
    if (error || isConfirmed) {
      setShowAlert(true);
      if (isConfirmed && onRefresh) {
        onRefresh();
      }
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, isConfirmed, onRefresh]);

  return (
    <>
      <Alert
        isCorrect={!error && isConfirmed}
        showAlert={showAlert}
        alertText={isConfirmed ? "Reward claimed!" : "Error claiming reward"}
      />
      {isEligible && (
        <div className="relative w-full">
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
      )}
    </>
  );
}
