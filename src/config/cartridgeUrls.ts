import { fetchVersion } from "../queries/fetchVersion";

const DEFAULT_RPC_URL = "http://localhost:5050";
const DEFAULT_TORII_URL = "http://localhost:8080";
const DEFAULT_GRAPHQL_URL = "http://localhost:8080/graphql";
const DEFAULT_ENV = "prod";
const AWS_TESTNET_RPC_URL = "https://katana.testnet.jokersofneon.com";
const AWS_TESTNET_TORII_URL = "https://torii.testnet.jokersofneon.com";
const AWS_TESTNET_GRAPHQL_URL =
  "https://torii.testnet.jokersofneon.com/graphql";
const AWS_TESTNET_CHAIN_ID = "KATANA";

const configuredEnv =
  import.meta.env.VITE_ENV?.trim().toLowerCase() || DEFAULT_ENV;
const configuredSlotInstance =
  import.meta.env.VITE_SLOT_INSTANCE?.trim() || undefined;
const isAwsProfile = configuredEnv.includes("aws");
let slotSource: "version-api" | "env" | "default" = isAwsProfile
  ? "env"
  : configuredSlotInstance
    ? "env"
    : "default";
export const usesCustomKatanaEndpoint = isAwsProfile;
export const slotChainId = isAwsProfile ? AWS_TESTNET_CHAIN_ID : undefined;

const getBaseUrl = (slot: string | undefined) =>
  slot ? `https://api.cartridge.gg/x/${slot}` : undefined;

const getRpcUrl = (slot: string | undefined) => {
  if (isAwsProfile) {
    return AWS_TESTNET_RPC_URL;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/katana` : DEFAULT_RPC_URL;
};

const getToriiUrl = (slot: string | undefined) => {
  if (isAwsProfile) {
    return AWS_TESTNET_TORII_URL;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/torii` : DEFAULT_TORII_URL;
};

const getGraphqlUrl = (slot: string | undefined) => {
  if (isAwsProfile) {
    return AWS_TESTNET_GRAPHQL_URL;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/torii/graphql` : DEFAULT_GRAPHQL_URL;
};

export let slotInstance = isAwsProfile ? configuredEnv : configuredSlotInstance;
export let rpcUrl = getRpcUrl(slotInstance);
export let toriiUrl = getToriiUrl(slotInstance);
export let graphqlUrl = getGraphqlUrl(slotInstance);

let preloadSlotInstancePromise: Promise<void> | null = null;

export const preloadSlotInstance = async () => {
  if (!preloadSlotInstancePromise) {
    preloadSlotInstancePromise = (async () => {
      const versionData = await fetchVersion();
      const slotFromApi = versionData.slot?.[configuredEnv]?.trim();

      if (!isAwsProfile && slotFromApi) {
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
        chainId: slotChainId ?? null,
        usesCustomKatanaEndpoint,
      });
      console.info("[CONFIG-LOG] Endpoint configuration resolved", {
        rpcUrl,
        toriiUrl,
        graphqlUrl,
      });
    })();
  }

  await preloadSlotInstancePromise;
};
