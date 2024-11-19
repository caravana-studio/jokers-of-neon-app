import ControllerConnector from "@cartridge/connector/controller";
import { ColorMode } from "@cartridge/controller";
import { policies } from "./policies";

const theme: string = "jokers-of-neon";
const slot: string = import.meta.env.VITE_SLOT_INSTANCE || "jon-slot";
const namespace: string = "jokers_of_neon";
const colorMode: ColorMode = "dark";

export const controller = new ControllerConnector({
  rpc: import.meta.env.VITE_RPC_URL,
  namespace,
  slot,
  policies,
  theme,
  colorMode,
});