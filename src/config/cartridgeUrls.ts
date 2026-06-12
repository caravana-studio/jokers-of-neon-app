import { fetchVersion } from "../queries/fetchVersion";

const DEFAULT_RPC_URL = "http://localhost:5050";
const DEFAULT_TORII_URL = "http://localhost:8080";
const DEFAULT_GRAPHQL_URL = "http://localhost:8080/graphql";
const DEFAULT_ENV = "prod";

const configuredEnv = import.meta.env.VITE_ENV?.trim().toLowerCase() || DEFAULT_ENV;
const configuredSlotInstance = import.meta.env.VITE_SLOT_INSTANCE?.trim() || undefined;
let slotSource: "version-api" | "version-endpoint" | "env" | "default" =
  configuredSlotInstance ? "env" : "default";

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

export let slotInstance = configuredSlotInstance;
export let rpcUrl = getRpcUrl(slotInstance);
export let toriiUrl = getToriiUrl(slotInstance);
export let graphqlUrl = getGraphqlUrl(slotInstance);
export let slotChainId: string | undefined = undefined;

let preloadSlotInstancePromise: Promise<void> | null = null;

export const preloadSlotInstance = async () => {
  if (!preloadSlotInstancePromise) {
    preloadSlotInstancePromise = (async () => {
      const versionData = await fetchVersion();
      const endpointConfig = versionData.slotEndpoints?.[configuredEnv];
      const slotFromApi = versionData.slot?.[configuredEnv]?.trim();

      if (endpointConfig) {
        slotInstance = endpointConfig.slotInstance?.trim() || configuredEnv;
        rpcUrl = endpointConfig.rpcUrl?.trim() || getRpcUrl(slotInstance);
        toriiUrl = endpointConfig.toriiUrl?.trim() || getToriiUrl(slotInstance);
        graphqlUrl =
          endpointConfig.graphqlUrl?.trim() || getGraphqlUrl(slotInstance);
        slotChainId = endpointConfig.chainId?.trim() || undefined;
        slotSource = "version-endpoint";
      } else if (slotFromApi) {
        slotInstance = slotFromApi;
        slotSource = "version-api";

        rpcUrl = getRpcUrl(slotInstance);
        toriiUrl = getToriiUrl(slotInstance);
        graphqlUrl = getGraphqlUrl(slotInstance);
        slotChainId = undefined;
      } else {
        rpcUrl = getRpcUrl(slotInstance);
        toriiUrl = getToriiUrl(slotInstance);
        graphqlUrl = getGraphqlUrl(slotInstance);
        slotChainId = undefined;
      }

      console.info("[CONFIG-LOG] Slot configuration resolved", {
        env: configuredEnv,
        source: slotSource,
        slotInstance: slotInstance ?? null,
      });
      console.info("[CONFIG-LOG] Endpoint configuration resolved", {
        rpcUrl,
        toriiUrl,
        graphqlUrl,
        chainId: slotChainId ?? null,
      });
    })();
  }

  await preloadSlotInstancePromise;
};
