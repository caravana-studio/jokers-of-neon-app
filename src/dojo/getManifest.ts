import manifestMainnet from "../manifest_mainnet.json";
import manifestSlot from "../manifest_slot.json";

const DEFAULT_MANIFEST_ENV = "prod";
const MANIFEST_API_BASE_URL = "https://jokersofneon.com/manifest";

const normalizeManifest = (manifest: any) => {
  const abis = Array.isArray(manifest?.abis)
    ? manifest.abis
    : Array.isArray(manifest?.world?.abi)
      ? manifest.world.abi
      : [];

  if (!Array.isArray(manifest?.contracts)) {
    return { ...manifest, abis };
  }

  const contracts = manifest.contracts.map((contract: any) => {
    if (Array.isArray(contract?.abi) && contract.abi.length > 0) {
      return contract;
    }
    return { ...contract, abi: abis };
  });

  return { ...manifest, abis, contracts };
};

const configuredManifestEnv = import.meta.env.VITE_ENV?.trim().toLowerCase();

const getLocalManifest = (env: string) => {
  if (env === "slot" || env === "dev" || env === "test") {
    return manifestSlot;
  }

  if (env !== "mainnet" && env !== "prod") {
    console.warn(
      `[manifest] Unknown VITE_ENV="${env}". Falling back to local "${DEFAULT_MANIFEST_ENV}" manifest.`
    );
  }

  return manifestMainnet;
};

const manifestEnv = configuredManifestEnv || DEFAULT_MANIFEST_ENV;
let resolvedManifest = normalizeManifest(getLocalManifest(manifestEnv));
let preloadManifestPromise: Promise<void> | null = null;

export const preloadManifest = async () => {
  if (!preloadManifestPromise) {
    preloadManifestPromise = (async () => {
      const manifestUrl = `${MANIFEST_API_BASE_URL}/manifest_${manifestEnv}.json`;

      try {
        const response = await fetch(manifestUrl, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const manifestFromApi = await response.json();
        resolvedManifest = normalizeManifest(manifestFromApi);
      } catch (error) {
        console.warn(
          `[manifest] Failed to fetch "${manifestUrl}". Using local "${manifestEnv}" fallback.`,
          error
        );
      }
    })();
  }

  await preloadManifestPromise;
};

export const getManifest = () => resolvedManifest;
