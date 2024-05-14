import { createDojoConfig } from "@dojoengine/core";
import manifest from "./src/manifest.json";

const rpcUrl = import.meta.env.VITE_RPC_URL || "http://localhost:5050"
const toriiUrl = import.meta.env.VITE_TORII_URL || "http://localhost:8080"
const relayUrl = import.meta.env.VITE_RELAY_URL || ""

export const dojoConfig = createDojoConfig({
    manifest, rpcUrl, toriiUrl, relayUrl
});
