import { createDojoConfig } from "@dojoengine/core";
import { rpcUrl, toriiUrl } from "./src/config/cartridgeUrls";
import { getManifest } from "./src/dojo/getManifest";

const masterAddress =
  import.meta.env.VITE_MASTER_ADDRESS ||
  "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03";
const masterPrivateKey =
  import.meta.env.VITE_MASTER_PRIVATE_KEY ||
  "0x1800000000300000180000000000030000000000003006001800006600";

const manifest = getManifest();
const manifestAny = manifest as {
  abis?: unknown[];
  world?: { abi?: unknown[] };
};
const manifestWithAbis = Array.isArray(manifestAny.abis)
  ? manifest
  : { ...manifest, abis: manifestAny.world?.abi ?? [] };

export const dojoConfig = createDojoConfig({
  manifest: manifestWithAbis,
  rpcUrl,
  toriiUrl,
  masterAddress,
  masterPrivateKey,
});
