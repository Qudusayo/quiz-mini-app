import { IncomingMessage, ServerResponse } from "http";
import { createClient } from "@supabase/supabase-js";

interface ServerlessResponse extends ServerResponse {
	status: (statusCode: number) => ServerlessResponse;
	json: (body: Record<string, unknown>) => void;
}

type ApiHandler = (
	req: IncomingMessage,
	res: ServerlessResponse,
) => Promise<void> | void;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handler: ApiHandler = async (req, res) => {
  try {
    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // Fetch top 10 winners from yesterday
    const { data, error } = await supabase
      .from("daily_challenges")
      .select("wallet_address, score, time_taken")
      .eq("date_played", yesterdayStr)
      .order("score", { ascending: false })
      .order("time_taken", { ascending: true })
      .limit(10);

    if (error) {
      throw error;
    }

    return res.status(200).json({ 
      date: yesterdayStr,
      winners: data || [] 
    });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch winners',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default handler;