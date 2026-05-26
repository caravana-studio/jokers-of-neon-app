import { SessionConnector } from "@cartridge/connector";
import ControllerConnector from "@cartridge/connector/controller";
import { AuthOptions } from "@cartridge/controller";
import { constants, shortString } from "starknet";
import { rpcUrl, slotInstance } from "../../config/cartridgeUrls";
import { isNative, isNativeAndroid } from "../../utils/capacitorUtils";
import { policies } from "./policies";

const standaloneMainnetRpc = import.meta.env.VITE_STARKNET_RPC_URL?.trim();
const isStandaloneShopMode = import.meta.env.MODE === "standalone-shop";
const shouldUseStandaloneMainnetRpc =
  isStandaloneShopMode && !!standaloneMainnetRpc;

const CHAIN =
  shouldUseStandaloneMainnetRpc
    ? "mainnet"
    : slotInstance || import.meta.env.VITE_CHAIN || "jokers-of-neon";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

const getChainId = (chain: string) => {
  if (chain === "mainnet") {
    return constants.StarknetChainId.SN_MAIN;
  } else if (chain === "sepolia") {
    return constants.StarknetChainId.SN_SEPOLIA;
  } else {
    throw new Error(`Chain ${chain} not supported`);
  }
};

export const getSlotChainId = (slot: string) => {
  return shortString.encodeShortString(
    `WP_${slot.toUpperCase().replaceAll("-", "_")}`
  );
};

const defaultChainId =
  CHAIN === "mainnet" || CHAIN === "sepolia"
    ? getChainId(CHAIN)
    : getSlotChainId(CHAIN);

const RPC_URL = shouldUseStandaloneMainnetRpc ? standaloneMainnetRpc : rpcUrl;

const signupOptions: AuthOptions = isNativeAndroid
  ? ["google", "discord", "password"]
  : ["google", "discord", "webauthn", "password"];

const controllerOptions = {
  chains: [{ rpcUrl: RPC_URL }],
  defaultChainId,
  preset: import.meta.env.VITE_CONTROLLER_PRESET,
  namespace: DOJO_NAMESPACE,
  policies,
  slot: undefined,
  signupOptions,
};

if (
  !shouldUseStandaloneMainnetRpc &&
  CHAIN !== "mainnet" &&
  CHAIN !== "sepolia"
) {
  controllerOptions.slot = CHAIN;
}

console.log('policies', policies)

export const controller =
  !isNative
    ? new ControllerConnector(controllerOptions)
    : new SessionConnector({
        policies,
        rpc: RPC_URL,
        chainId: defaultChainId,
        redirectUrl: "jokers://open",
        disconnectRedirectUrl: "jokers://open",
        signupOptions,
      });
