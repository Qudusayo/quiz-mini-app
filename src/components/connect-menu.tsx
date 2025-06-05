import { useAccount, useConnect } from "wagmi";
import { useFarcaster } from "../contexts/farcaster-context";
import { maskWalletAddress } from "../../utils";

export function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { farcasterUser } = useFarcaster();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 absolute top-3 right-3">
        <div className="flex items-center gap-2 pr-3 p-1.5 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
          <div className="size-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {farcasterUser?.pfp_url ? (
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
          </div>
          <span className="font-medium">
            {farcasterUser?.username || maskWalletAddress(address)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white absolute top-3 right-3">
      <button
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
        className="px-3 py-1.5 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
      >
        Connect
      </button>
    </div>
  );
}
