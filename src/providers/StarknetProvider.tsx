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
import { rpcUrl, slotInstance } from "../config/cartridgeUrls";
import { controller, getSlotChainId } from "../dojo/controller/controller";

const standaloneMainnetRpc = import.meta.env.VITE_STARKNET_RPC_URL?.trim();
const isStandaloneShopMode = import.meta.env.MODE === "standalone-shop";
const shouldUseStandaloneMainnetRpc =
  isStandaloneShopMode && !!standaloneMainnetRpc;
const effectiveRpcUrl = shouldUseStandaloneMainnetRpc
  ? standaloneMainnetRpc
  : rpcUrl;

function rpc() {
  return {
    nodeUrl: effectiveRpcUrl,
  };
}

const SLOT_INSTANCE = shouldUseStandaloneMainnetRpc ? undefined : slotInstance;

const slot: Chain = SLOT_INSTANCE && {
  id: num.toBigInt(getSlotChainId(SLOT_INSTANCE)),
  name: "Jokers of Neon",
  network: "jokers-of-neon",
  rpcUrls: {
    default: {
      http: [effectiveRpcUrl],
    },
    public: {
      http: [effectiveRpcUrl],
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
