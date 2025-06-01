import { Link } from "react-router";
import { useAccount, useReadContract } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import ArrowBack from "../components/arrow-back";
import UserIcon from "../components/user-icon";
import contractABI from "../abi.json";
import { zeroAddress } from "viem";
import { celoAlfajores } from "wagmi/chains";
import { ClaimReward } from "../components/claim-reward";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

async function fetchUserScores(address: string) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const [todayResult, yesterdayResult] = await Promise.all([
    supabase
      .from("daily_challenges")
      .select("score")
      .eq("wallet_address", address)
      .eq("date_played", today)
      .single(),
    supabase
      .from("daily_challenges")
      .select("score")
      .eq("wallet_address", address)
      .eq("date_played", yesterdayStr)
      .single(),
  ]);

  return {
    todayScore: todayResult.data?.score || 0,
    yesterdayScore: yesterdayResult.data?.score || 0,
  };
}

function Profile() {
  const { address } = useAccount();

  const { data: scores, isLoading } = useQuery({
    queryKey: ["user-scores", address],
    queryFn: () => (address ? fetchUserScores(address) : null),
    enabled: !!address,
  });

  const { data: userReward, isLoading: isLoadingReward } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: "getUserReward",
    args: address ? [address] : [zeroAddress],
    chainId: celoAlfajores.id,
  });

  const isEligible = userReward && Number(userReward) > 0;

  return (
    <div className="relative pt-12">
      <Link
        to="/"
        className="absolute top-4 left-4 text-white hover:text-white transition-colors text-lg flex items-center"
      >
        <ArrowBack />
        <span className="ml-2 font-semibold">Back</span>
      </Link>

      {/* Profile section */}
      <div className="flex flex-col items-center p-8 gap-3">
        {/* Profile icon with border */}
        <div className="size-44 rounded-full border-white flex items-center justify-center bg-white/10">
          <UserIcon className="size-36 stroke-2" />
        </div>
        <h1 className="text-2xl font-bold text-white mt-8 uppercase">
          User Profile
        </h1>

        {/* User Address */}
        <div className="w-full">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">Wallet Address</p>
            <p className="text-white font-bold text-xl">
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Not Connected"}
            </p>
          </div>
        </div>

        {/* Scores Section */}
        <div className="w-full grid grid-cols-2 gap-3">
          {/* Today's Score */}
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">Today's Score</p>
            <p className="text-white text-2xl font-bold">
              {isLoading ? "Loading..." : scores?.todayScore || 0}
            </p>
          </div>

          {/* Yesterday's Score */}
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">Yesterday's Score</p>
            <p className="text-white text-2xl font-bold">
              {isLoading ? "Loading..." : scores?.yesterdayScore || 0}
            </p>
          </div>
        </div>

        {/* Reward Eligibility Status */}
        <div className="w-full">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">Reward Status</p>
            <div className="flex items-center gap-2">
              <div
                className={`size-3 rounded-full ${
                  isEligible ? "bg-green-500" : "bg-yellow-500"
                }`}
              ></div>
              <p className="text-white font-bold text-xl">
                {isLoadingReward
                  ? "Checking..."
                  : isEligible
                  ? `Eligible`
                  : "Not Eligible"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ClaimReward isEligible={!!isEligible} />
    </div>
  );
}

export default Profile;
