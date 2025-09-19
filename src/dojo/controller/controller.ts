import ControllerConnector from "@cartridge/connector/controller";
import SessionConnector from "@cartridge/connector/session";
import { constants, shortString } from "starknet";
import { policies } from "./policies";
import { isNative } from "../../utils/capacitorUtils";

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

const controllerOptions = {
  chains: [{ rpcUrl: RPC_URL }],
  defaultChainId,
  preset: "jokers-of-neon",
  namespace: DOJO_NAMESPACE,
  policies,
  slot: undefined,
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
        redirectUrl:
          typeof window !== "undefined" ? window.location.origin : "",
      }));
