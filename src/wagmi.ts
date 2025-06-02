import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { http, createConfig, injected } from "wagmi";
import { celo } from "wagmi/chains";
import { sdk } from "@farcaster/frame-sdk";

const isMiniApp = await sdk.isInMiniApp();

export const config = createConfig({
  chains: [celo],
  connectors: isMiniApp ? [farcasterFrame()] : [injected()],
  transports: {
    [celo.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
