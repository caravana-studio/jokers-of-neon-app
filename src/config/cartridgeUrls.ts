import { fetchVersion } from "../queries/fetchVersion";

const DEFAULT_RPC_URL = "http://localhost:5050";
const DEFAULT_TORII_URL = "http://localhost:8080";
const DEFAULT_GRAPHQL_URL = "http://localhost:8080/graphql";
const DEFAULT_ENV = "prod";

const configuredEnv = import.meta.env.VITE_ENV?.trim().toLowerCase() || DEFAULT_ENV;
const configuredSlotInstance = import.meta.env.VITE_SLOT_INSTANCE?.trim() || undefined;

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

let preloadSlotInstancePromise: Promise<void> | null = null;

export const preloadSlotInstance = async () => {
  if (!preloadSlotInstancePromise) {
    preloadSlotInstancePromise = (async () => {
      const versionData = await fetchVersion();
      const slotFromApi = versionData.slot?.[configuredEnv]?.trim();

      if (slotFromApi) {
        slotInstance = slotFromApi;
      }

      rpcUrl = getRpcUrl(slotInstance);
      toriiUrl = getToriiUrl(slotInstance);
      graphqlUrl = getGraphqlUrl(slotInstance);
    })();
  }

  await preloadSlotInstancePromise;
};
