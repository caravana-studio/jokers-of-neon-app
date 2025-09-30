"use client";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
  voyager
} from "@starknet-react/core";
import React from "react";
import { num } from "starknet";
import { controller, getSlotChainId } from "../dojo/controller/controller";

function rpc() {
  return {
    nodeUrl: import.meta.env.VITE_RPC_URL,
  };
}

const SLOT_INSTANCE = import.meta.env.VITE_SLOT_INSTANCE

const slot: Chain = SLOT_INSTANCE && {
  id: num.toBigInt(getSlotChainId(SLOT_INSTANCE)),
  name: "Jokers of Neon",
  network: "jokers-of-neon",
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL],
    },
    public: {
      http: [import.meta.env.VITE_RPC_URL],
    },
  },
  nativeCurrency: {
    name: "Starknet",
    symbol: "STRK",
    decimals: 18,
    address: "0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D",
  },
  paymasterRpcUrls: {
    avnu: {
       http: ["http://localhost:5050"],
    },
  },
}

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const provider = jsonRpcProvider({ rpc });

  return (
    <StarknetConfig
      chains={SLOT_INSTANCE ? [slot, mainnet, sepolia] : [mainnet, sepolia]}
      provider={provider}
      connectors={[controller as unknown as Connector]}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
