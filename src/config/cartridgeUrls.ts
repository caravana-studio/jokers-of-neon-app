import { fetchVersion } from "../queries/fetchVersion";
import { shortString } from "starknet";

const DEFAULT_RPC_URL = "http://localhost:5050";
const DEFAULT_TORII_URL = "http://localhost:8080";
const DEFAULT_GRAPHQL_URL = "http://localhost:8080/graphql";
const DEFAULT_ENV = "prod";

const configuredEnv = import.meta.env.VITE_ENV?.trim().toLowerCase() || DEFAULT_ENV;
const configuredSlotInstance = import.meta.env.VITE_SLOT_INSTANCE?.trim() || undefined;
let slotSource: "version-api" | "env" | "default" =
  configuredSlotInstance ? "env" : "default";
let endpointSource: "version-api" | "slot" | "default" =
  configuredSlotInstance ? "slot" : "default";

const getBaseUrl = (slot: string | undefined) =>
  slot ? `https://api.cartridge.gg/x/${slot}` : undefined;

const getRpcUrl = (slot: string | undefined) => {
  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/katana` : DEFAULT_RPC_URL;
};

const getToriiUrl = (slot: string | undefined) => {
  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/torii` : DEFAULT_TORII_URL;
};

const getGraphqlUrl = (slot: string | undefined) => {
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

export let slotInstance = configuredSlotInstance;
export let slotChainId: string | undefined;
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
        slotInstance = endpointFromApi.slotInstance?.trim() || configuredEnv;
        slotChainId = normalizeChainId(endpointFromApi.chainId);
        slotSource = "version-api";
        endpointSource = "version-api";
        rpcUrl = endpointFromApi.rpcUrl?.trim() || getRpcUrl(slotInstance);
        toriiUrl = endpointFromApi.toriiUrl?.trim() || getToriiUrl(slotInstance);
        graphqlUrl =
          endpointFromApi.graphqlUrl?.trim() || getGraphqlUrl(slotInstance);
      } else if (slotFromApi) {
        slotInstance = slotFromApi;
        slotChainId = undefined;
        slotSource = "version-api";
        endpointSource = "slot";
        rpcUrl = getRpcUrl(slotInstance);
        toriiUrl = getToriiUrl(slotInstance);
        graphqlUrl = getGraphqlUrl(slotInstance);
      } else {
        slotChainId = undefined;
        rpcUrl = getRpcUrl(slotInstance);
        toriiUrl = getToriiUrl(slotInstance);
        graphqlUrl = getGraphqlUrl(slotInstance);
      }

      console.info("[CONFIG-LOG] Slot configuration resolved", {
        env: configuredEnv,
        source: slotSource,
        slotInstance: slotInstance ?? null,
        slotChainId: slotChainId ?? null,
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
