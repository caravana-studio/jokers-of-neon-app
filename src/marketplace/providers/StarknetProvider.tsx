"use client";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
  voyager,
} from "@starknet-react/core";
import React from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { constants } from "starknet";
import {
  CHAIN,
  MARKETPLACE_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  STRK_ADDRESS,
  ETH_ADDRESS,
  STARKNET_RPC_URL,
} from "../config/contracts";

function rpc() {
  return { nodeUrl: STARKNET_RPC_URL };
}

const defaultChainId =
  CHAIN === "mainnet"
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA;

export const controller = new ControllerConnector({
  chains: [{ rpcUrl: STARKNET_RPC_URL }],
  defaultChainId,
  signupOptions: ["google", "discord", "webauthn", "password"],
  policies: MARKETPLACE_CONTRACT_ADDRESS
    ? [
        // Marketplace contract
        {
          target: MARKETPLACE_CONTRACT_ADDRESS,
          method: "fill_order",
          description: "Buy a card listing",
        },
        {
          target: MARKETPLACE_CONTRACT_ADDRESS,
          method: "cancel_order",
          description: "Cancel a listing",
        },
        {
          target: MARKETPLACE_CONTRACT_ADDRESS,
          method: "cancel_all_orders_below",
          description: "Cancel all listings",
        },
        // ERC20 approvals for buying
        {
          target: STRK_ADDRESS,
          method: "approve",
          description: "Approve STRK spending",
        },
        {
          target: ETH_ADDRESS,
          method: "approve",
          description: "Approve ETH spending",
        },
        // NFT approval for selling
        ...(NFT_CONTRACT_ADDRESS
          ? [
              {
                target: NFT_CONTRACT_ADDRESS,
                method: "approve",
                description: "Approve NFT for listing",
              },
            ]
          : []),
        // Message signing policy for order creation (SNIP-12 Rev1)
        // Cartridge's toWasmPolicies always uses Rev1 to compute scope_hash;
        // this must match what signOrder.ts sends to account.signMessage.
        {
          types: {
            StarknetDomain: [
              { name: "name", type: "shortstring" },
              { name: "version", type: "shortstring" },
              { name: "chainId", type: "shortstring" },
              { name: "revision", type: "shortstring" },
            ],
            Order: [{ name: "orderHash", type: "felt" }],
          },
          primaryType: "Order",
          domain: {
            name: "JokersOfNeonMarketplace",
            version: "1",
            chainId: defaultChainId,
            revision: "1",
          },
        },
      ]
    : [],
});

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
