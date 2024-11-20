import { createDojoConfig } from "@dojoengine/core";
import manifest from "./src/manifest.json";

const rpcUrl = import.meta.env.VITE_RPC_URL || "http://localhost:5050";
const toriiUrl = import.meta.env.VITE_TORII_URL || "http://localhost:8080";
const relayUrl = import.meta.env.VITE_RELAY_URL || "";
const masterAddress =
  import.meta.env.VITE_MASTER_ADDRESS ||
  "0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03";
const masterPrivateKey =
  import.meta.env.VITE_MASTER_PRIVATE_KEY ||
  "0x1800000000300000180000000000030000000000003006001800006600";
const accountClassHash =
  import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH ||
  "0x079d9ce84b97bcc2a631996c3100d57966fc2f5b061fb1ec4dfd0040976bcac6";
const feeTokenAddress =
  import.meta.env.VITE_NETWORK_FEE_TOKEN ||
  "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

export const dojoConfig = createDojoConfig({
  manifest,
  rpcUrl,
  toriiUrl,
  relayUrl,
  masterAddress,
  masterPrivateKey,
  accountClassHash,
  feeTokenAddress,
});
