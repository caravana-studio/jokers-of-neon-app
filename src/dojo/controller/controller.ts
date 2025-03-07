import ControllerConnector from "@cartridge/connector/controller";
import { shortString } from "starknet";
import { policies } from "./policies";

const SLOT = import.meta.env.VITE_SLOT_INSTANCE || "jokers-of-neon";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

const defaultChainId = shortString.encodeShortString(
  `WP_${SLOT.toUpperCase().replace("-", "_")}`
);

const isDev = import.meta.env.VITE_DEV === "true";

const RPC_URL = import.meta.env.VITE_RPC_URL || "http://localhost:5050";

export const controller =
  !isDev &&
  new ControllerConnector({
    policies,
    chains: [{ rpcUrl: RPC_URL }],
    defaultChainId,
    namespace: DOJO_NAMESPACE,
    slot: SLOT,
    preset: "jokers-of-neon",
  });
