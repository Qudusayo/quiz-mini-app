import { ethers } from "ethers";
import { IncomingMessage, ServerResponse } from "http";
import { createClient } from "@supabase/supabase-js";

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as string;

const provider = new ethers.JsonRpcProvider(process.env.CELO_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contractABI = [
  {
    inputs: [
      { internalType: "address[]", name: "users", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    name: "setRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

interface ServerlessResponse extends ServerResponse {
  status: (statusCode: number) => ServerlessResponse;
  json: (body: Record<string, unknown>) => void;
}

type ApiHandler = (
  req: IncomingMessage,
  res: ServerlessResponse
) => Promise<void> | void;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getWinners = async (yesterdayStr: string) => {
  // Fetch top 10 winners from yesterday
  const { data, error } = await supabase
    .from("daily_challenges")
    .select("wallet_address")
    .eq("date_played", yesterdayStr)
    .order("score", { ascending: false })
    .order("time_taken", { ascending: true })
    .limit(10);

  if (error) {
    throw error;
  }

  const winners = data?.map((winner) => winner.wallet_address);
  return winners;
};

const rewardWinners = async (winners: string[]) => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);
  const REWARD_AMOUNT = 0.001;

  const amounts = Array(winners.length).fill(
    ethers.parseUnits(REWARD_AMOUNT.toString(), 18)
  );

  try {
    const tx = await contract.setRewards(winners, amounts);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Failed to set rewards:", error);
  }
};

const handler: ApiHandler = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const winners = await getWinners(yesterdayStr);

    const tx = await rewardWinners(winners);

    return res.status(200).json({
      winners: winners || [],
      tx,
      date: yesterdayStr,
    });
  } catch (error) {
    console.error("Error fetching winners:", error);
    return res.status(500).json({
      error: "Failed to fetch winners",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default handler;
