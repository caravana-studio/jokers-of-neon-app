import { SessionConnector } from "@cartridge/connector";
import ControllerConnector from "@cartridge/connector/controller";
import { AuthOptions, FeeSource } from "@cartridge/controller";
import { constants, RpcProvider, shortString } from "starknet";
import type { AccountInterface } from "starknet";
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
const controllerRpcProvider = new RpcProvider({ nodeUrl: resolvedRpcUrl });

const signupOptions: AuthOptions = isNativeAndroid
  ? ["google", "discord", "password"]
  : ["google", "discord", "webauthn", "password"];

const controllerOptions = {
  chains: [{ rpcUrl: resolvedRpcUrl }],
  defaultChainId,
  preset: import.meta.env.VITE_CONTROLLER_PRESET,
  shouldOverridePresetPolicies: usesCustomKatanaEndpoint,
  namespace: DOJO_NAMESPACE,
  policies,
  feeSource: usesCustomKatanaEndpoint ? FeeSource.PAYMASTER : undefined,
  slot: usesCustomKatanaEndpoint ? undefined : resolvedSlot,
  signupOptions,
};

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

const isContractNotFound = (error: unknown) => {
  const rpcError = error as {
    code?: number;
    message?: string;
    baseError?: { code?: number; message?: string };
  };
  const message = `${rpcError?.message ?? ""} ${rpcError?.baseError?.message ?? ""}`.toLowerCase();
  return (
    rpcError?.code === 20 ||
    rpcError?.baseError?.code === 20 ||
    message.includes("contract not found") ||
    message.includes("is not deployed")
  );
};

export const ensureControllerAccountDeployed = async (
  account?: AccountInterface | null
) => {
  if (!usesCustomKatanaEndpoint || !account?.address || isNative) {
    return;
  }

  try {
    await controllerRpcProvider.getClassAt(account.address, "latest");
    return;
  } catch (error) {
    if (!isContractNotFound(error)) {
      throw error;
    }
  }

  const keychain = (controllerConnector as any)?.controller?.keychain;
  if (typeof keychain?.deploy !== "function") {
    throw new Error(
      "Controller account is not deployed on this Katana and deploy() is not available"
    );
  }

  console.info("[CONTROLLER] deploying account on custom Katana", {
    address: account.address,
    rpcUrl: resolvedRpcUrl,
  });

  const deployResponse = await keychain.deploy();
  if (deployResponse?.code !== "SUCCESS" || !deployResponse.transaction_hash) {
    throw new Error(
      deployResponse?.message || "Controller account deploy failed"
    );
  }

  await controllerRpcProvider.waitForTransaction(
    deployResponse.transaction_hash,
    { retryInterval: 1000 }
  );

  console.info("[CONTROLLER] account deployed on custom Katana", {
    address: account.address,
    transactionHash: deployResponse.transaction_hash,
  });
};

if (!isNative && usesCustomKatanaEndpoint) {
  const cartridgeConnector = controllerConnector as ControllerConnector;
  const connectController = cartridgeConnector.connect.bind(cartridgeConnector);
  let sessionPoliciesSyncedFor: string | null = null;

  cartridgeConnector.connect = async (args) => {
    const connectResult = await connectController(args);
    const account = cartridgeConnector.controller.account as
      | AccountInterface
      | undefined;

    await ensureControllerAccountDeployed(account);

    if (account?.address && sessionPoliciesSyncedFor !== account.address) {
      await cartridgeConnector.controller.updateSession({ policies });
      sessionPoliciesSyncedFor = account.address;
    }

    return connectResult;
  };
}

export const controller = controllerConnector;
