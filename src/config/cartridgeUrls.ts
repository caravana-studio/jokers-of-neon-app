import { shortString } from "starknet";
import { fetchVersion } from "../queries/fetchVersion";

const DEFAULT_RPC_URL = "http://localhost:5050";
const DEFAULT_TORII_URL = "http://localhost:8080";
const DEFAULT_GRAPHQL_URL = "http://localhost:8080/graphql";
const DEFAULT_ENV = "prod";
const DEFAULT_AWS_KATANA_RPC_URL = "https://katana.testnet.jokersofneon.com";
const DEFAULT_AWS_TORII_URL = "https://torii.testnet.jokersofneon.com";
const DEFAULT_AWS_KATANA_CHAIN_ID = "KATANA";

const configuredEnv =
  import.meta.env.VITE_ENV?.trim().toLowerCase() || DEFAULT_ENV;
const configuredSlotInstance =
  import.meta.env.VITE_SLOT_INSTANCE?.trim() || undefined;
const configuredAwsKatanaRpcUrl =
  import.meta.env.VITE_AWS_KATANA_RPC_URL?.trim() ||
  DEFAULT_AWS_KATANA_RPC_URL;
const configuredAwsToriiUrl =
  import.meta.env.VITE_AWS_TORII_URL?.trim() || DEFAULT_AWS_TORII_URL;
const configuredAwsKatanaChainId =
  import.meta.env.VITE_AWS_KATANA_CHAIN_ID?.trim() ||
  DEFAULT_AWS_KATANA_CHAIN_ID;
const isAwsProfile = configuredEnv.includes("aws");

let slotSource: "version-api" | "version-endpoint" | "env" | "default" =
  isAwsProfile
    ? "env"
    : configuredSlotInstance
      ? "env"
      : "default";
let endpointSource:
  | "version-api"
  | "version-endpoint"
  | "slot"
  | "env"
  | "default" = isAwsProfile
  ? "env"
  : configuredSlotInstance
    ? "slot"
    : "default";

export const usesCustomKatanaEndpoint = isAwsProfile;

type SlotEndpoint = {
  kind?: string;
  slotInstance?: string;
  rpcUrl?: string;
  toriiUrl?: string;
  graphqlUrl?: string;
  relayUrl?: string;
  chainId?: string;
};

let slotEndpoint: SlotEndpoint | undefined;

const getBaseUrl = (slot: string | undefined) =>
  slot ? `https://api.cartridge.gg/x/${slot}` : undefined;

const getRpcUrl = (slot: string | undefined) => {
  if (slotEndpoint?.rpcUrl) {
    return slotEndpoint.rpcUrl.trim();
  }

  if (isAwsProfile) {
    return configuredAwsKatanaRpcUrl;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/katana` : DEFAULT_RPC_URL;
};

const getToriiUrl = (slot: string | undefined) => {
  if (slotEndpoint?.toriiUrl) {
    return slotEndpoint.toriiUrl.trim();
  }

  if (isAwsProfile) {
    return configuredAwsToriiUrl;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/torii` : DEFAULT_TORII_URL;
};

const getGraphqlUrl = (slot: string | undefined) => {
  if (slotEndpoint?.graphqlUrl) {
    return slotEndpoint.graphqlUrl.trim();
  }

  if (isAwsProfile) {
    return `${configuredAwsToriiUrl}/graphql`;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/torii/graphql` : DEFAULT_GRAPHQL_URL;
};

const normalizeChainId = (chainId: string | undefined) => {
  const normalizedChainId = chainId?.trim();
  if (!normalizedChainId) {
    return undefined;
  }

  return normalizedChainId.startsWith("0x")
    ? normalizedChainId
    : shortString.encodeShortString(normalizedChainId);
};

export let slotInstance = isAwsProfile ? configuredEnv : configuredSlotInstance;
export let slotChainId: string | undefined = isAwsProfile
  ? normalizeChainId(configuredAwsKatanaChainId)
  : undefined;
export let rpcUrl = getRpcUrl(slotInstance);
export let toriiUrl = getToriiUrl(slotInstance);
export let graphqlUrl = getGraphqlUrl(slotInstance);

let preloadSlotInstancePromise: Promise<void> | null = null;

export const preloadSlotInstance = async () => {
  if (!preloadSlotInstancePromise) {
    preloadSlotInstancePromise = (async () => {
      const versionData = await fetchVersion();
      const slotFromApi = versionData.slot?.[configuredEnv]?.trim();
      const endpointFromApi = versionData.slotEndpoints?.[configuredEnv];

      if (endpointFromApi) {
        slotEndpoint = endpointFromApi;
        slotInstance =
          endpointFromApi.slotInstance?.trim() ||
          slotFromApi ||
          (isAwsProfile ? configuredEnv : configuredSlotInstance);
        slotChainId =
          normalizeChainId(endpointFromApi.chainId) ||
          (isAwsProfile ? normalizeChainId(configuredAwsKatanaChainId) : undefined);
        slotSource = "version-endpoint";
        endpointSource = "version-endpoint";
        rpcUrl = endpointFromApi.rpcUrl?.trim() || getRpcUrl(slotInstance);
        toriiUrl = endpointFromApi.toriiUrl?.trim() || getToriiUrl(slotInstance);
        graphqlUrl =
          endpointFromApi.graphqlUrl?.trim() || getGraphqlUrl(slotInstance);
      } else if (!isAwsProfile && slotFromApi) {
        slotEndpoint = undefined;
        slotInstance = slotFromApi;
        slotChainId = undefined;
        slotSource = "version-api";
        endpointSource = "slot";
        rpcUrl = getRpcUrl(slotInstance);
        toriiUrl = getToriiUrl(slotInstance);
        graphqlUrl = getGraphqlUrl(slotInstance);
      } else {
        slotEndpoint = undefined;
        slotInstance = isAwsProfile ? configuredEnv : configuredSlotInstance;
        slotChainId = isAwsProfile
          ? normalizeChainId(configuredAwsKatanaChainId)
          : undefined;
        slotSource = isAwsProfile
          ? "env"
          : configuredSlotInstance
            ? "env"
            : "default";
        endpointSource = isAwsProfile
          ? "env"
          : configuredSlotInstance
            ? "slot"
            : "default";
        rpcUrl = getRpcUrl(slotInstance);
        toriiUrl = getToriiUrl(slotInstance);
        graphqlUrl = getGraphqlUrl(slotInstance);
      }

      console.info("[CONFIG-LOG] Slot configuration resolved", {
        env: configuredEnv,
        source: slotSource,
        slotInstance: slotInstance ?? null,
        slotChainId: slotChainId ?? null,
        usesCustomKatanaEndpoint,
      });
      console.info("[CONFIG-LOG] Endpoint configuration resolved", {
        source: endpointSource,
        rpcUrl,
        toriiUrl,
        graphqlUrl,
      });
    })();
  }

  await preloadSlotInstancePromise;
};
