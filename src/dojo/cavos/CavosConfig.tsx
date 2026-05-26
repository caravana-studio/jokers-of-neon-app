import { CavosProvider as CavosSDKProvider, useCavos } from "@cavos/react";
import React, { ReactNode } from "react";
import { getContractByName } from "@dojoengine/core";
import { getManifest, getManifestSource } from "../getManifest";
import { rpcUrl as slotRpcUrl, slotInstance } from "../../config/cartridgeUrls";
import { getSlotChainId } from "../controller/controller";
import { setupWorld } from "../typescript/contracts.gen";
import { CavosBridgeContext } from "./CavosBridgeContext";

const CAVOS_APP_ID =
  import.meta.env.VITE_CAVOS_APP_ID || "";

const CAVOS_PAYMASTER_API_KEY =
  import.meta.env.VITE_CAVOS_PAYMASTER_API_KEY || "";

const CAVOS_STARKNET_RPC_URL =
  import.meta.env.VITE_STARKNET_RPC_URL ||
  "https://api.cartridge.gg/x/starknet/mainnet";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

const VRF_PROVIDER_ADDRESS =
  import.meta.env.VITE_VRF_PROVIDER_ADDRESS ||
  "0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f";

const CAVOS_SLOT_RELAYER_ADDRESS =
  import.meta.env.VITE_CAVOS_SLOT_RELAYER_ADDRESS ||
  "0x22e94ff47f8fa53124b4465775d79f57d345ade18a77602a33a37cd0bfd0bb2";

const CAVOS_SLOT_RELAYER_PRIVATE_KEY =
  import.meta.env.VITE_CAVOS_SLOT_RELAYER_PRIVATE_KEY ||
  "0x49a3b5e422219fbe4fabf9d853666818155287ff9e3715f241e75e80b4ff43c";

export const CAVOS_ENABLED = !!CAVOS_APP_ID;

const CAVOS_SESSION_STORAGE_KEYS = [
  "cavos_oauth_session",
  "cavos_oauth_pre_auth",
  "cavos_session_data",
];

const CAVOS_LOCAL_STORAGE_KEYS = [
  "cavos_magic_link_pre_auth",
  "cavos_auth_result",
];

const normalizeAddress = (address?: string | null): string | null => {
  if (!address) {
    return null;
  }

  try {
    return `0x${BigInt(address).toString(16)}`;
  } catch {
    return address.toLowerCase();
  }
};

const getGeneratedContractNames = (): string[] => {
  const mockProvider = {
    execute: () => Promise.resolve({}),
    call: () => Promise.resolve({}),
  };

  return Object.keys(setupWorld(mockProvider as any));
};

const getAllowedContracts = (): string[] => {
  const manifest = getManifest();
  const contracts: string[] = [];
  const systemNames = getGeneratedContractNames();

  for (const name of systemNames) {
    const contract = getContractByName(manifest, DOJO_NAMESPACE, name);
    if (contract?.address) {
      contracts.push(contract.address);
    }
  }

  contracts.push(VRF_PROVIDER_ADDRESS);

  return contracts;
};

const clearStoredCavosSession = () => {
  CAVOS_SESSION_STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));
  CAVOS_LOCAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

const clearStaleCavosSessionPolicy = (allowedContracts: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const storedSession = sessionStorage.getItem("cavos_oauth_session");
  if (!storedSession) {
    return;
  }

  try {
    const session = JSON.parse(storedSession);
    const storedAllowedContracts = new Set(
      (session?.sessionPolicy?.allowedContracts ?? [])
        .map((address: string) => normalizeAddress(address))
        .filter(Boolean)
    );
    const currentAllowedContracts = allowedContracts
      .map((address) => normalizeAddress(address))
      .filter(Boolean);

    const isMissingCurrentContract = currentAllowedContracts.some(
      (address) => !storedAllowedContracts.has(address)
    );

    if (!isMissingCurrentContract) {
      return;
    }

    console.warn("[CAVOS] Clearing stale stored session policy", {
      manifestSource: getManifestSource(),
      storedAllowedContracts: storedAllowedContracts.size,
      currentAllowedContracts: currentAllowedContracts.length,
    });
    clearStoredCavosSession();
  } catch (error) {
    console.warn("[CAVOS] Failed to inspect stored session policy; clearing it", error);
    clearStoredCavosSession();
  }
};

/**
 * Inner component that calls useCavos() (which requires CavosProvider above)
 * and forwards the result through CavosBridgeContext.
 */
const CavosBridge: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cavos = useCavos();

  return (
    <CavosBridgeContext.Provider value={cavos}>
      {children}
    </CavosBridgeContext.Provider>
  );
};

interface CavosWrapperProps {
  children: ReactNode;
}

export const CavosWrapper: React.FC<CavosWrapperProps> = ({ children }) => {
  if (!CAVOS_APP_ID) {
    return <>{children}</>;
  }

  const allowedContracts = getAllowedContracts();
  clearStaleCavosSessionPolicy(allowedContracts);

  return (
    <CavosSDKProvider
      config={{
        appId: CAVOS_APP_ID,
        network: "mainnet",
        paymasterApiKey: CAVOS_PAYMASTER_API_KEY,
        enableLogging: false,
        starknetRpcUrl: CAVOS_STARKNET_RPC_URL,
        slot: {
          rpcUrl: slotRpcUrl,
          chainId: getSlotChainId(slotInstance),
          relayerAddress: CAVOS_SLOT_RELAYER_ADDRESS,
          relayerPrivateKey: CAVOS_SLOT_RELAYER_PRIVATE_KEY,
        },
        session: {
          defaultPolicy: {
            spendingLimits: [],
            allowedContracts,
            maxCallsPerTx: 10,
          },
        },
      }}
    >
      <CavosBridge>
        {children}
      </CavosBridge>
    </CavosSDKProvider>
  );
};
