import { CavosProvider as CavosSDKProvider, useCavos } from "@cavos/react";
import React, { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { getContractByName } from "@dojoengine/core";
import { getManifest } from "../getManifest";
import { rpcUrl as slotRpcUrl, slotInstance } from "../../config/cartridgeUrls";
import { getSlotChainId } from "../controller/controller";
import { setupWorld } from "../typescript/contracts.gen";

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

// Bridge context: exposes useCavos() result to components outside CavosProvider
const CavosBridgeContext = createContext<ReturnType<typeof useCavos> | null>(null);

/**
 * Safe hook — returns the Cavos SDK state when CavosProvider is in the tree, null otherwise.
 * Can be called unconditionally from any component.
 */
export const useCavosSafe = () => useContext(CavosBridgeContext);

/**
 * Inner component that calls useCavos() (which requires CavosProvider above)
 * and forwards the result through CavosBridgeContext.
 */
const CavosBridge: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cavos = useCavos();

  React.useEffect(() => {
    console.log("[CAVOS-BRIDGE] Cavos SDK state:", {
      isAuthenticated: cavos.isAuthenticated,
      isLoading: cavos.isLoading,
      address: cavos.address,
      user: cavos.user,
      walletStatus: cavos.walletStatus,
      hasActiveSession: cavos.hasActiveSession,
      pendingDeployTxHash: cavos.walletStatus?.pendingDeployTxHash,
      isSlotDeploying: cavos.walletStatus?.isSlotDeploying,
      isSlotDeployed: cavos.walletStatus?.isSlotDeployed,
      pendingSlotDeployTxHash: cavos.walletStatus?.pendingSlotDeployTxHash,
      hasSlotProvider: !!cavos.getSlotProvider?.(),
    });
  }, [
    cavos.isAuthenticated,
    cavos.isLoading,
    cavos.address,
    cavos.walletStatus,
    cavos.hasActiveSession,
  ]);

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
  const instanceIdRef = useRef(Math.random().toString(36).slice(2, 8));

  useEffect(() => {
    console.log("[CAVOS-DEBUG] CavosWrapper mounted", {
      instanceId: instanceIdRef.current,
      hasAppId: !!CAVOS_APP_ID,
      network: "mainnet",
      starknetRpcUrl: CAVOS_STARKNET_RPC_URL,
      slotRpcUrl,
    });

    return () => {
      console.log("[CAVOS-DEBUG] CavosWrapper unmounted", {
        instanceId: instanceIdRef.current,
      });
    };
  }, []);

  if (!CAVOS_APP_ID) {
    return <>{children}</>;
  }

  const allowedContracts = getAllowedContracts();

  return (
    <CavosSDKProvider
      config={{
        appId: CAVOS_APP_ID,
        network: "mainnet",
        paymasterApiKey: CAVOS_PAYMASTER_API_KEY,
        enableLogging: true,
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
