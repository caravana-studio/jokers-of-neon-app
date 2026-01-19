import { createDojoConfig } from "@dojoengine/core";
import { getManifest } from "./src/dojo/getManifest";

const rpcUrl = import.meta.env.VITE_RPC_URL || "http://localhost:5050";
const toriiUrl = import.meta.env.VITE_TORII_URL || "http://localhost:8080";
const masterAddress =
  import.meta.env.VITE_MASTER_ADDRESS ||
  "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03";
const masterPrivateKey =
  import.meta.env.VITE_MASTER_PRIVATE_KEY ||
  "0x1800000000300000180000000000030000000000003006001800006600";

const manifest = getManifest()

export const dojoConfig = createDojoConfig({
  manifest,
  rpcUrl,
  toriiUrl,
  masterAddress,
  masterPrivateKey,
});
