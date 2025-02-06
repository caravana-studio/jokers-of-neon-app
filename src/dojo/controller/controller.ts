import ControllerConnector from "@cartridge/connector/controller";
import { ColorMode } from "@cartridge/controller";
import { policies } from "./policies";
import { constants } from "starknet";


export const controller = new ControllerConnector({
  policies,
  chains: [
    { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
    { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA
});
