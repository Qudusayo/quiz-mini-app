import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FarcasterUser } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeHtmlEntities(text: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export const fetchFarcasterUsers = async (
  addresses: string[]
): Promise<Record<string, FarcasterUser[]>> => {
  if (addresses.length === 0) return {};

  const options = {
    method: "GET",
    headers: {
      "x-api-key": import.meta.env.VITE_NEYNAR_API_KEY,
      "x-neynar-experimental": "false",
    },
  };

  const addressesParam = addresses.join("%2C");
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addressesParam}`,
    options
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Farcaster users");
  }

  return response.json();
};
