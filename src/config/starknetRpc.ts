import { isNative } from "../utils/capacitorUtils";

const dedicatedMainnetRpcUrl =
  import.meta.env.VITE_DEDICATED_STARKNET_RPC_URL?.trim();
const legacyMainnetRpcUrl = import.meta.env.VITE_STARKNET_RPC_URL?.trim();

export function getConfiguredMainnetRpcUrl(): string | undefined {
  if (isNative) {
    return legacyMainnetRpcUrl || undefined;
  }

  return dedicatedMainnetRpcUrl || legacyMainnetRpcUrl || undefined;
}
