import { fetchVersion } from "../queries/fetchVersion";

const DEFAULT_RPC_URL = "http://localhost:5050";
const DEFAULT_TORII_URL = "http://localhost:8080";
const DEFAULT_GRAPHQL_URL = "http://localhost:8080/graphql";
const DEFAULT_ENV = "prod";

const configuredEnv = import.meta.env.VITE_ENV?.trim().toLowerCase() || DEFAULT_ENV;
const configuredSlotInstance = import.meta.env.VITE_SLOT_INSTANCE?.trim() || undefined;
const configuredRpcUrl = import.meta.env.VITE_SLOT_RPC_URL?.trim() || undefined;
const configuredToriiUrl = import.meta.env.VITE_TORII_URL?.trim() || undefined;
const configuredGraphqlUrl = import.meta.env.VITE_GRAPHQL_URL?.trim() || undefined;
const hasEndpointOverrides = Boolean(
  configuredRpcUrl || configuredToriiUrl || configuredGraphqlUrl
);

let slotSource: "version-api" | "env" | "endpoint-env" | "default" =
  hasEndpointOverrides
    ? "endpoint-env"
    : configuredSlotInstance
      ? "env"
      : "default";

const endpointSource = hasEndpointOverrides ? "env" : "slot";

const getBaseUrl = (slot: string | undefined) =>
  slot ? `https://api.cartridge.gg/x/${slot}` : undefined;

const getRpcUrl = (slot: string | undefined) => {
  if (configuredRpcUrl) {
    return configuredRpcUrl;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/katana` : DEFAULT_RPC_URL;
};

const getToriiUrl = (slot: string | undefined) => {
  if (configuredToriiUrl) {
    return configuredToriiUrl;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/torii` : DEFAULT_TORII_URL;
};

const getGraphqlUrl = (slot: string | undefined) => {
  if (configuredGraphqlUrl) {
    return configuredGraphqlUrl;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/torii/graphql` : DEFAULT_GRAPHQL_URL;
};

export let slotInstance = configuredSlotInstance;
export let rpcUrl = getRpcUrl(slotInstance);
export let toriiUrl = getToriiUrl(slotInstance);
export let graphqlUrl = getGraphqlUrl(slotInstance);

let preloadSlotInstancePromise: Promise<void> | null = null;

export const preloadSlotInstance = async () => {
  if (!preloadSlotInstancePromise) {
    preloadSlotInstancePromise = (async () => {
      const versionData = await fetchVersion();
      const slotFromApi = versionData.slot?.[configuredEnv]?.trim();

      if (!hasEndpointOverrides && slotFromApi) {
        slotInstance = slotFromApi;
        slotSource = "version-api";
      }

      rpcUrl = getRpcUrl(slotInstance);
      toriiUrl = getToriiUrl(slotInstance);
      graphqlUrl = getGraphqlUrl(slotInstance);

      console.info("[CONFIG-LOG] Slot configuration resolved", {
        env: configuredEnv,
        source: slotSource,
        slotInstance: slotInstance ?? null,
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
