import { useAccount, useConnect, useSignMessage } from "wagmi";

export function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <div className="text-white">
        <div>Connected account:</div>
        <div>{address}</div>
        <SignButton />
      </div>
    );
  }

  return (
    <div className="text-white">
      <button
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
      >
        Connect
      </button>
    </div>
  );
}

function SignButton() {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <>
      <button
        type="button"
        onClick={() => signMessage({ message: "hello world" })}
        disabled={isPending}
      >
        {isPending ? "Signing..." : "Sign message"}
      </button>
      {data && (
        <div className="text-white">
          <div>Signature</div>
          <div>{data}</div>
        </div>
      )}
      {error && (
        <div className="text-red-500">
          <div>Error</div>
          <div>{error.message}</div>
        </div>
      )}
    </>
  );
}
