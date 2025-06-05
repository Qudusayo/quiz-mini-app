import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import { useAccount } from "wagmi";
import { Link } from "react-router";
import ArrowBack from "../components/arrow-back";
import { fetchFarcasterUsers } from "../../utils";

interface LeaderboardEntry {
  wallet_address: string;
  score: number;
  time_taken: number;
}

const fetchTopTen = async (): Promise<LeaderboardEntry[]> => {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("daily_challenges")
    .select("wallet_address, score, time_taken")
    .eq("date_played", today)
    .order("score", { ascending: false })
    .order("time_taken", { ascending: true })
    .limit(20);

  return data || [];
};

const fetchUserRank = async (
  walletAddress: string
): Promise<{ entry: LeaderboardEntry; rank: number } | null> => {
  const today = new Date().toISOString().slice(0, 10);

  // First get the user's entry
  const { data: userEntry } = await supabase
    .from("daily_challenges")
    .select("wallet_address, score, time_taken")
    .eq("date_played", today)
    .eq("wallet_address", walletAddress)
    .single();

  if (!userEntry) return null;

  // Then count how many entries are better than the user's
  const { count } = await supabase
    .from("daily_challenges")
    .select("*", { count: "exact", head: true })
    .eq("date_played", today)
    .or(
      `score.gt.${userEntry.score},and(score.eq.${userEntry.score},time_taken.lt.${userEntry.time_taken})`
    );

  return {
    entry: userEntry,
    rank: (count || 0) + 1,
  };
};

const Leaderboard = () => {
  const { address: currentUserAddress } = useAccount();

  const {
    data: topTen = [],
    isLoading: isLoadingTopTen,
    error: topTenError,
  } = useQuery({
    queryKey: ["leaderboard", "top10"],
    queryFn: fetchTopTen,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: true,
  });

  const { data: userRankData } = useQuery({
    queryKey: ["leaderboard", "userRank", currentUserAddress],
    queryFn: () =>
      currentUserAddress ? fetchUserRank(currentUserAddress) : null,
    enabled: !!currentUserAddress,
    refetchOnReconnect: false,
    retry: true,
  });

  const displayEntries =
    userRankData && userRankData.rank > 10
      ? [...topTen, userRankData.entry]
      : topTen;

  const { data: farcasterUsers = {}, isLoading: isLoadingFarcasterUsers } =
    useQuery({
      queryKey: ["farcasterUsers", displayEntries.map((e) => e.wallet_address)],
      queryFn: () =>
        fetchFarcasterUsers(displayEntries.map((e) => e.wallet_address)),
      enabled: displayEntries.length > 0,
    });

  const maskWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderLoading = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white">
          {isLoadingTopTen
            ? "Loading leaderboard..."
            : isLoadingFarcasterUsers
            ? "Loading user profiles..."
            : "Loading..."}
        </div>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Error loading leaderboard
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 h-full flex flex-col">
      <Link
        to="/"
        className="absolute top-4 left-4 text-white hover:text-white transition-colors text-lg flex items-center"
      >
        <ArrowBack />
        <span className="ml-2 font-semibold">Back</span>
      </Link>
      <h1 className="text-3xl font-bold text-center mt-8 mb-5 text-white uppercase ">
        Leaderboard
      </h1>
      {isLoadingTopTen || isLoadingFarcasterUsers ? (
        renderLoading()
      ) : topTenError ? (
        renderError()
      ) : (
        <div className="overflow-auto border-2 border-white/40 h-[600px] flex-grow">
          <div className="max-h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-black/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {displayEntries.map((entry, index) => {
                  const isCurrentUser =
                    entry.wallet_address.toLowerCase() ===
                    currentUserAddress?.toLowerCase();
                  const rank =
                    isCurrentUser && userRankData
                      ? userRankData.rank
                      : index + 1;
                  const isSeparator =
                    index === 10 && userRankData && userRankData.rank > 10;

                  const farcasterUser =
                    farcasterUsers[entry.wallet_address.toLowerCase()]?.[0];

                  return (
                    <tr
                      key={entry.wallet_address}
                      className={`${isCurrentUser ? "bg-white/5" : ""} ${
                        isSeparator ? "border-t-1 border-white/40" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white ">
                        #{rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 ">
                        {farcasterUser ? (
                          <div className="flex items-center gap-2">
                            {/* <div className="size-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                              {farcasterUser.pfp_url ? (
                                <img
                                  src={farcasterUser.pfp_url}
                                  alt={farcasterUser.display_name}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="size-5"
                                >
                                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              )}
                            </div> */}
                            <span className="font-medium">
                              @{farcasterUser.username}
                            </span>
                          </div>
                        ) : (
                          maskWalletAddress(entry.wallet_address)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white ">
                        {entry.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white ">
                        {formatTime(entry.time_taken)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
