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

const getLocalManifest = (
  env: string
): { manifest: any; file: "manifest_slot.json" | "manifest_mainnet.json" } => {
  if (env === "local" || env === "slot" || env === "dev" || env === "test") {
    return { manifest: manifestSlot, file: "manifest_slot.json" };
  }

  if (!env.startsWith("aws-") && env !== "mainnet" && env !== "prod") {
    console.warn(
      `[manifest] Unknown VITE_ENV="${env}". Falling back to local "${DEFAULT_MANIFEST_ENV}" manifest.`
    );
  }

  return { manifest: manifestMainnet, file: "manifest_mainnet.json" };
};

const manifestEnv = configuredManifestEnv || DEFAULT_MANIFEST_ENV;
const initialLocalManifest = getLocalManifest(manifestEnv);
let resolvedManifest = normalizeManifest(initialLocalManifest.manifest);
let preloadManifestPromise: Promise<void> | null = null;
let manifestSource: { source: "local" | "remote"; detail: string } = {
  source: "local",
  detail: initialLocalManifest.file,
};

console.info("[CONFIG-LOG] Manifest configuration initialized", {
  env: manifestEnv,
  source: manifestSource.source,
  detail: manifestSource.detail,
});

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
        manifestSource = { source: "remote", detail: manifestUrl };
        console.info("[CONFIG-LOG] Manifest configuration resolved", {
          env: manifestEnv,
          source: manifestSource.source,
          detail: manifestSource.detail,
        });
      } catch (error) {
        console.warn(
          `[manifest] Failed to fetch "${manifestUrl}". Using local "${manifestEnv}" fallback.`,
          error
        );
        const fallbackLocalManifest = getLocalManifest(manifestEnv);
        manifestSource = {
          source: "local",
          detail: fallbackLocalManifest.file,
        };
        console.info("[CONFIG-LOG] Manifest configuration resolved", {
          env: manifestEnv,
          source: manifestSource.source,
          detail: manifestSource.detail,
        });
      }
    })();
  }

  await preloadManifestPromise;
};

export const getManifest = () => resolvedManifest;
export const getManifestSource = () => manifestSource;
