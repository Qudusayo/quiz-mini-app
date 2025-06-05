import { createContext, useContext, ReactNode } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { FarcasterUser } from "../../types";
import { fetchFarcasterUsers } from "../../utils";

interface FarcasterContextType {
  farcasterUser: FarcasterUser | null;
  isLoading: boolean;
  error: Error | null;
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(
  undefined
);

async function fetchFarcasterUser(address: string) {
  const response = await fetchFarcasterUsers([address]);

  if (!response) {
    throw new Error("Failed to fetch Farcaster user");
  }
  return response[address.toLowerCase()]?.[0] || null;
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();

  const {
    data: farcasterUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["farcasterUser", address],
    queryFn: () => fetchFarcasterUser(address || ""),
    enabled: !!address,
  });

  return (
    <FarcasterContext.Provider
      value={{ farcasterUser: farcasterUser || null, isLoading, error }}
    >
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  const context = useContext(FarcasterContext);
  if (context === undefined) {
    throw new Error("useFarcaster must be used within a FarcasterProvider");
  }
  return context;
}
