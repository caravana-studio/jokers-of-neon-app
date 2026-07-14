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
let slotSource: "version-api" | "version-endpoint" | "env" | "default" = isAwsProfile
  ? "env"
  : configuredSlotInstance
    ? "env"
    : "default";
export const usesCustomKatanaEndpoint = isAwsProfile;
export let slotChainId = isAwsProfile
  ? configuredAwsKatanaChainId
  : undefined;

type SlotEndpoint = {
  slotInstance?: string;
  rpcUrl?: string;
  toriiUrl?: string;
  graphqlUrl?: string;
  chainId?: string;
};

let slotEndpoint: SlotEndpoint | undefined;

const getBaseUrl = (slot: string | undefined) =>
  slot ? `https://api.cartridge.gg/x/${slot}` : undefined;

const getRpcUrl = (slot: string | undefined) => {
  if (slotEndpoint?.rpcUrl) {
    return slotEndpoint.rpcUrl;
  }

  if (isAwsProfile) {
    return configuredAwsKatanaRpcUrl;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/katana` : DEFAULT_RPC_URL;
};

const getToriiUrl = (slot: string | undefined) => {
  if (slotEndpoint?.toriiUrl) {
    return slotEndpoint.toriiUrl;
  }

  if (isAwsProfile) {
    return configuredAwsToriiUrl;
  }

  const baseUrl = getBaseUrl(slot);
  return baseUrl ? `${baseUrl}/torii` : DEFAULT_TORII_URL;
};

const getGraphqlUrl = (slot: string | undefined) => {
  if (slotEndpoint?.graphqlUrl) {
    return slotEndpoint.graphqlUrl;
  }

  if (isAwsProfile) {
    return `${configuredAwsToriiUrl}/graphql`;
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
      const endpointFromApi = versionData.slotEndpoints?.[configuredEnv];
      const slotFromApi = versionData.slot?.[configuredEnv]?.trim();

      if (endpointFromApi) {
        slotEndpoint = endpointFromApi;
        slotInstance =
          endpointFromApi.slotInstance?.trim() || slotFromApi || slotInstance;
        slotChainId = endpointFromApi.chainId?.trim() || slotChainId;
        slotSource = "version-endpoint";
      } else if (!isAwsProfile && slotFromApi) {
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
