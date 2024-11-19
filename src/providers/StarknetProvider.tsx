
"use client";
import ControllerConnector from "@cartridge/connector/controller";
import { ColorMode } from "@cartridge/controller";
import { mainnet, sepolia } from "@starknet-react/chains";
import { Connector, StarknetConfig, jsonRpcProvider, voyager } from "@starknet-react/core";
import React from "react";
import { policies } from "./policies";

const theme: string = "jokers-of-neon";
const slot: string = import.meta.env.VITE_SLOT_INSTANCE || "jon-dojo1";
const namespace: string = "jokers_of_neon";
const colorMode: ColorMode = "dark";

const controller = new ControllerConnector({
  rpc: import.meta.env.VITE_PUBLIC_NODE_URL,
  namespace,
  slot,
  policies,
  theme,
  colorMode,
});

function rpc() {
  return {
    nodeUrl: import.meta.env.VITE_RPC_URL,
  };
}

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const provider = jsonRpcProvider({ rpc });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={[controller as unknown as Connector]}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}