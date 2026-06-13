import { SessionConnector } from "@cartridge/connector";
import ControllerConnector from "@cartridge/connector/controller";
import { AuthOptions, FeeSource } from "@cartridge/controller";
import { constants, shortString } from "starknet";
import {
  rpcUrl,
  slotChainId,
  slotInstance,
  usesCustomKatanaEndpoint,
} from "../../config/cartridgeUrls";
import { isNative, isNativeAndroid } from "../../utils/capacitorUtils";
import { policies } from "./policies";

const standaloneMainnetRpc = import.meta.env.VITE_STARKNET_RPC_URL?.trim();
const isStandaloneShopMode = import.meta.env.MODE === "standalone-shop";
const shouldUseStandaloneMainnetRpc =
  isStandaloneShopMode && !!standaloneMainnetRpc;

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

const getChainId = (chain: string) => {
  if (chain === "mainnet") {
    return constants.StarknetChainId.SN_MAIN;
  } else if (chain === "sepolia") {
    return constants.StarknetChainId.SN_SEPOLIA;
  } else {
    throw new Error(`Chain ${chain} not supported`);
  }
};

const encodeChainId = (chainId: string) =>
  chainId.startsWith("0x") ? chainId : shortString.encodeShortString(chainId);

export const getSlotChainId = (slot?: string) => {
  if (slotChainId) {
    return encodeChainId(slotChainId);
  }

  const resolvedSlot = slot || "jokers-of-neon";
  return shortString.encodeShortString(
    `WP_${resolvedSlot.toUpperCase().replaceAll("-", "_")}`
  );
};

const resolvedChain =
  shouldUseStandaloneMainnetRpc ? "mainnet" : slotInstance || "jokers-of-neon";
const resolvedSlot =
  resolvedChain === "mainnet" ||
  resolvedChain === "sepolia"
    ? undefined
    : resolvedChain;
const defaultChainId =
  usesCustomKatanaEndpoint
    ? getSlotChainId(slotInstance)
    : resolvedSlot !== undefined
      ? getSlotChainId(resolvedSlot)
      : getChainId(resolvedChain);
const resolvedRpcUrl =
  shouldUseStandaloneMainnetRpc ? standaloneMainnetRpc || rpcUrl : rpcUrl;

const signupOptions: AuthOptions = isNativeAndroid
  ? ["google", "discord", "password"]
  : ["google", "discord", "webauthn", "password"];

const controllerOptions = {
  chains: [{ rpcUrl: resolvedRpcUrl }],
  defaultChainId,
  propagateSessionErrors: false,
  preset: import.meta.env.VITE_CONTROLLER_PRESET,
  shouldOverridePresetPolicies: usesCustomKatanaEndpoint,
  namespace: DOJO_NAMESPACE,
  policies,
  feeSource: usesCustomKatanaEndpoint ? FeeSource.PAYMASTER : undefined,
  slot: usesCustomKatanaEndpoint ? undefined : resolvedSlot,
  signupOptions,
};

const logControllerIframeState = (stage: string) => {
  if (!usesCustomKatanaEndpoint || typeof document === "undefined") {
    return;
  }

  const iframe = document.getElementById(
    "controller-keychain"
  ) as HTMLIFrameElement | null;

  console.info("[CONTROLLER-DEBUG] iframe", {
    stage,
    src: iframe?.src ?? null,
    hasSlotParam: iframe?.src ? iframe.src.includes("ps=") : false,
    hasRpcUrlParam: iframe?.src ? iframe.src.includes("rpc_url=") : false,
  });
};

const safeControllerStringify = (payload: unknown) => {
  try {
    return JSON.stringify(payload);
  } catch {
    return "[unserializable]";
  }
};

const logControllerDebug = (label: string, payload: unknown) => {
  console.info(`[CONTROLLER-DEBUG] ${label}`, payload);
  console.info(
    `[CONTROLLER-DEBUG_JSON] ${label} ${safeControllerStringify(payload)}`
  );
};

const callRpc = async (method: string, params: unknown[]) => {
  const response = await fetch(resolvedRpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }),
  });
  const payload = await response.json();
  if (payload.error) {
    throw payload.error;
  }
  return payload.result;
};

const getAccountDeploymentStatus = async (address: string) => {
  try {
    const classHash = await callRpc("starknet_getClassHashAt", [
      "latest",
      address,
    ]);
    return { deployed: true, classHash, error: null };
  } catch (error) {
    const rpcError = error as { code?: number; message?: string };
    return {
      deployed: rpcError.code === 20 ? false : null,
      classHash: null,
      error: rpcError,
    };
  }
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number) =>
  Promise.race<T | { timeout: true }>([
    promise,
    new Promise<{ timeout: true }>((resolve) =>
      setTimeout(() => resolve({ timeout: true }), timeoutMs)
    ),
  ]);

const ensureControllerAccountDeployed = async (
  cartridgeConnector: ControllerConnector,
  accountAddress: string
) => {
  const before = await getAccountDeploymentStatus(accountAddress);
  logControllerDebug("account.deployment:before", {
    account: accountAddress,
    ...before,
  });

  if (before.deployed !== false) {
    return;
  }

  const keychain = (cartridgeConnector.controller as any)?.keychain;
  if (typeof keychain?.deploy !== "function") {
    logControllerDebug("account.deploy:skip", {
      account: accountAddress,
      reason: "keychain.deploy unavailable",
    });
    return;
  }

  try {
    logControllerDebug("account.deploy:start", { account: accountAddress });
    const deployResponse = await withTimeout(keychain.deploy(), 20_000);
    logControllerDebug("account.deploy:end", {
      account: accountAddress,
      response: deployResponse,
    });

    if (
      deployResponse &&
      typeof deployResponse === "object" &&
      "timeout" in deployResponse
    ) {
      return;
    }

    const deployResult = deployResponse as
      | {
          code?: string;
          transaction_hash?: string;
          transactionHash?: string;
          message?: string;
        }
      | undefined;
    const deployTxHash =
      deployResult?.transaction_hash ?? deployResult?.transactionHash;

    if (deployResult?.code !== "SUCCESS" || !deployTxHash) {
      logControllerDebug("account.deploy:not-started", {
        account: accountAddress,
        reason: "deploy did not submit a transaction",
        response: deployResponse,
      });
      return;
    }

    for (let attempt = 1; attempt <= 10; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const after = await getAccountDeploymentStatus(accountAddress);
      logControllerDebug("account.deployment:poll", {
        account: accountAddress,
        attempt,
        ...after,
      });
      if (after.deployed) {
        return;
      }
    }
  } catch (error) {
    logControllerDebug("account.deploy:error", {
      account: accountAddress,
      error,
    });
  }
};

if (usesCustomKatanaEndpoint) {
  const playPolicyContracts = Object.entries(policies.contracts ?? {}).flatMap(
    ([contractAddress, contract]) => {
      const methods = (contract.methods ?? []) as Array<{
        entrypoint?: string;
      }>;
      return methods.some((method) => method.entrypoint === "play")
        ? [contractAddress]
        : [];
    }
  );

  const controllerDebugOptions = {
    env: import.meta.env.VITE_ENV ?? null,
    slotInstance: slotInstance ?? null,
    resolvedSlot: resolvedSlot ?? null,
    controllerSlot: controllerOptions.slot ?? null,
    defaultChainId,
    rpcUrl: resolvedRpcUrl,
    preset: controllerOptions.preset ?? null,
    feeSource: controllerOptions.feeSource ?? null,
    propagateSessionErrors: controllerOptions.propagateSessionErrors,
    namespace: DOJO_NAMESPACE,
    usesCustomKatanaEndpoint,
    policyContractCount: Object.keys(policies.contracts ?? {}).length,
    playPolicyContracts,
  };

  logControllerDebug("options", controllerDebugOptions);
}

const controllerConnector =
  !isNative
    ? new ControllerConnector(controllerOptions)
    : new SessionConnector({
        policies,
        rpc: resolvedRpcUrl,
        chainId: defaultChainId,
        redirectUrl: "jokers://open",
        disconnectRedirectUrl: "jokers://open",
        signupOptions,
      });

if (!isNative && usesCustomKatanaEndpoint) {
  const cartridgeConnector = controllerConnector as ControllerConnector;
  const connectController = cartridgeConnector.connect.bind(cartridgeConnector);
  let sessionPoliciesSynced = false;

  cartridgeConnector.connect = async (args) => {
    console.info("[CONTROLLER-DEBUG] connect:start", {
      args,
      selectedChain: (cartridgeConnector.controller as any)?.selectedChain,
      rpcUrl: cartridgeConnector.controller.rpcUrl(),
    });
    logControllerIframeState("before-connect");

    try {
      const account = await connectController(args);

      if (!sessionPoliciesSynced) {
        console.info("[CONTROLLER-DEBUG] updateSession:start", {
          contractCount: Object.keys(policies.contracts ?? {}).length,
        });
        const response = await cartridgeConnector.controller.updateSession({
          policies,
        });
        sessionPoliciesSynced = true;
        console.info("[CONTROLLER-DEBUG] updateSession:end", {
          responseCode: (response as any)?.code ?? null,
          responseAddress: (response as any)?.address ?? null,
        });
      }

      const accountAddress =
        (account as any)?.address ??
        cartridgeConnector.controller.account?.address;
      if (accountAddress) {
        await ensureControllerAccountDeployed(
          cartridgeConnector,
          accountAddress
        );
      }

      return account;
    } finally {
      console.info("[CONTROLLER-DEBUG] connect:end", {
        account: cartridgeConnector.controller.account?.address ?? null,
      });
      logControllerIframeState("after-connect");
      setTimeout(() => logControllerIframeState("after-connect+1000ms"), 1000);
    }
  };

  setTimeout(() => logControllerIframeState("init+1000ms"), 1000);
}

export const controller = controllerConnector;
