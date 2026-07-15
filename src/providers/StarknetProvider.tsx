"use client";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
  voyager
} from "@starknet-react/core";
import React from "react";
import { num, shortString } from "starknet";
import { rpcUrl, slotChainId, slotInstance } from "../config/cartridgeUrls";
import { controller, getSlotChainId } from "../dojo/controller/controller";
import {
  isMigrateContext,
  migrateMainnetRpcUrl,
} from "../utils/migrateMainnet";
import { AppType, useAppContext } from "./AppContextProvider";

const standaloneMainnetRpc = import.meta.env.VITE_STARKNET_RPC_URL?.trim();
const isStandaloneShopMode = import.meta.env.MODE === "standalone-shop";
const shouldUseForcedMainnetRpc =
  isMigrateContext || (isStandaloneShopMode && !!standaloneMainnetRpc);
const effectiveRpcUrl = shouldUseForcedMainnetRpc
  ? isMigrateContext
    ? migrateMainnetRpcUrl
    : standaloneMainnetRpc
  : rpcUrl;

function rpc() {
  return {
    nodeUrl: effectiveRpcUrl,
  };
}

const SLOT_INSTANCE = shouldUseForcedMainnetRpc ? undefined : slotInstance;
const getStarknetChainId = (slot: string) =>
  num.toBigInt(
    slotChainId
      ? slotChainId.startsWith("0x")
        ? slotChainId
        : shortString.encodeShortString(slotChainId)
      : getSlotChainId(slot),
  );

const slot: Chain = SLOT_INSTANCE && {
  id: getStarknetChainId(SLOT_INSTANCE),
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
  const appType = useAppContext();
  const provider = jsonRpcProvider({ rpc });
  const connectors =
    appType === AppType.MINIAPP ? [] : [controller as unknown as Connector];

  return (
    <StarknetConfig
      chains={SLOT_INSTANCE ? [slot, mainnet, sepolia] : [mainnet, sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
