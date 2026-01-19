import { SessionConnector } from "@cartridge/connector";
import ControllerConnector from "@cartridge/connector/controller";
import { AuthOptions } from "@cartridge/controller";
import { constants, shortString } from "starknet";
import { isNative, isNativeAndroid } from "../../utils/capacitorUtils";
import { policies } from "./policies";

const CHAIN =
  import.meta.env.VITE_SLOT_INSTANCE ||
  import.meta.env.VITE_CHAIN ||
  "jokers-of-neon";

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

const isDev = import.meta.env.VITE_DEV === "true";

const RPC_URL = import.meta.env.VITE_RPC_URL || "http://localhost:5050";

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

if (CHAIN !== "mainnet" && CHAIN !== "sepolia") {
  controllerOptions.slot = CHAIN;
}

export const controller =
  !isDev &&
  (!isNative
    ? new ControllerConnector(controllerOptions)
    : new SessionConnector({
        policies,
        rpc: RPC_URL,
        chainId: defaultChainId,
        redirectUrl: "jokers://open",
        disconnectRedirectUrl: "jokers://open",
        signupOptions,
      }));
