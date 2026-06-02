import { isNative } from "../utils/capacitorUtils";

const dedicatedMainnetRpcUrl =
  import.meta.env.VITE_DEDICATED_STARKNET_RPC_URL?.trim();
const legacyMainnetRpcUrl = import.meta.env.VITE_STARKNET_RPC_URL?.trim();

type MainnetRpcSelection = {
  url: string | undefined;
  source:
    | "VITE_DEDICATED_STARKNET_RPC_URL"
    | "VITE_STARKNET_RPC_URL"
    | "none";
  mode:
    | "dedicated-mainnet"
    | "dedicated-same-as-default"
    | "native-default"
    | "default-fallback"
    | "missing";
};

function selectMainnetRpc(): MainnetRpcSelection {
  if (isNative) {
    return {
      url: legacyMainnetRpcUrl || undefined,
      source: legacyMainnetRpcUrl ? "VITE_STARKNET_RPC_URL" : "none",
      mode: legacyMainnetRpcUrl ? "native-default" : "missing",
    };
  }

  const url = dedicatedMainnetRpcUrl || legacyMainnetRpcUrl || undefined;

  return {
    url,
    source: dedicatedMainnetRpcUrl
      ? "VITE_DEDICATED_STARKNET_RPC_URL"
      : legacyMainnetRpcUrl
        ? "VITE_STARKNET_RPC_URL"
        : "none",
    mode: !url
      ? "missing"
      : dedicatedMainnetRpcUrl
        ? dedicatedMainnetRpcUrl === legacyMainnetRpcUrl
          ? "dedicated-same-as-default"
          : "dedicated-mainnet"
        : "default-fallback",
  };
}

function describeRpcEndpoint(rawUrl: string | undefined): string {
  if (!rawUrl) {
    return "missing";
  }

  try {
    const url = new URL(rawUrl);
    const path = url.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, 2)
      .join("/");

    return path ? `${url.hostname}/${path}` : url.hostname;
  } catch {
    return rawUrl.length > 40 ? `${rawUrl.slice(0, 24)}...` : rawUrl;
  }
}

const mainnetRpcSelection = selectMainnetRpc();

console.info(
  `[CONFIG-LOG] Mainnet RPC resolved mode=${mainnetRpcSelection.mode} source=${mainnetRpcSelection.source} endpoint=${describeRpcEndpoint(mainnetRpcSelection.url)}`
);

export function getConfiguredMainnetRpcUrl(): string | undefined {
  return mainnetRpcSelection.url;
}
