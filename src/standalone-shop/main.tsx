import { preloadSlotInstance } from "../config/cartridgeUrls";
import { preloadManifest } from "../dojo/getManifest";

void Promise.all([preloadSlotInstance(), preloadManifest()])
  .catch((error) => {
    console.warn("[bootstrap] Failed to preload startup configuration.", error);
  })
  .finally(async () => {
    await import("./mainApp.tsx");
  });
