import { SessionConnector } from "@cartridge/connector";
import ControllerConnector from "@cartridge/connector/controller";
import { AuthOptions } from "@cartridge/controller";
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
  preset: import.meta.env.VITE_CONTROLLER_PRESET,
  namespace: DOJO_NAMESPACE,
  policies,
  slot: resolvedSlot,
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

if (usesCustomKatanaEndpoint) {
  console.info("[CONTROLLER-DEBUG] options", {
    env: import.meta.env.VITE_ENV ?? null,
    slotInstance: slotInstance ?? null,
    resolvedSlot: resolvedSlot ?? null,
    defaultChainId,
    rpcUrl: resolvedRpcUrl,
    preset: controllerOptions.preset ?? null,
    namespace: DOJO_NAMESPACE,
    usesCustomKatanaEndpoint,
  });
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

  cartridgeConnector.connect = async (args) => {
    console.info("[CONTROLLER-DEBUG] connect:start", {
      args,
      selectedChain: (cartridgeConnector.controller as any)?.selectedChain,
      rpcUrl: cartridgeConnector.controller.rpcUrl(),
    });
    logControllerIframeState("before-connect");

    try {
      return await connectController(args);
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
