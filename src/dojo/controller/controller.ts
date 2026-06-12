import { SessionConnector } from "@cartridge/connector";
import ControllerConnector from "@cartridge/connector/controller";
import { AuthOptions } from "@cartridge/controller";
import { constants, shortString } from "starknet";
import { rpcUrl, slotChainId, slotInstance } from "../../config/cartridgeUrls";
import { isNative, isNativeAndroid } from "../../utils/capacitorUtils";
import { policies } from "./policies";

const standaloneMainnetRpc = import.meta.env.VITE_STARKNET_RPC_URL?.trim();
const isStandaloneShopMode = import.meta.env.MODE === "standalone-shop";
const shouldUseStandaloneMainnetRpc =
  isStandaloneShopMode && !!standaloneMainnetRpc;

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

const encodeChainId = (chainId: string) =>
  chainId.startsWith("0x") ? chainId : shortString.encodeShortString(chainId);

export const getSlotChainId = (slot?: string) => {
  if (slotChainId) {
    return encodeChainId(slotChainId);
  }

  const resolvedSlot = slot || "jokers-of-neon";
  return shortString.encodeShortString(
    `WP_${resolvedSlot.toUpperCase().replaceAll("-", "_")}`
  );
};

const resolvedChain =
  shouldUseStandaloneMainnetRpc ? "mainnet" : slotInstance || "jokers-of-neon";
const resolvedSlot =
  resolvedChain === "mainnet" || resolvedChain === "sepolia"
    ? undefined
    : resolvedChain;
const defaultChainId =
  resolvedSlot !== undefined
    ? getSlotChainId(resolvedSlot)
    : getChainId(resolvedChain);
const resolvedRpcUrl =
  shouldUseStandaloneMainnetRpc ? standaloneMainnetRpc || rpcUrl : rpcUrl;

const signupOptions: AuthOptions = isNativeAndroid
  ? ["google", "discord", "password"]
  : ["google", "discord", "webauthn", "password"];

const controllerOptions = {
  chains: [{ rpcUrl: resolvedRpcUrl }],
  defaultChainId,
  preset: import.meta.env.VITE_CONTROLLER_PRESET,
  namespace: DOJO_NAMESPACE,
  policies,
  slot: resolvedSlot,
  signupOptions,
};

export const controller =
  !isNative
    ? new ControllerConnector(controllerOptions)
    : new SessionConnector({
        policies,
        rpc: resolvedRpcUrl,
        chainId: defaultChainId,
        redirectUrl: "jokers://open",
        disconnectRedirectUrl: "jokers://open",
        signupOptions,
      });
