import { preloadSlotInstance } from "../config/cartridgeUrls";
import { preloadCurrentSeasonId } from "../constants/season";
import { preloadManifest } from "../dojo/getManifest";

void Promise.all([
  preloadSlotInstance(),
  preloadManifest(),
  preloadCurrentSeasonId(),
])
  .catch((error) => {
    console.warn("[bootstrap] Failed to preload startup configuration.", error);
  })
  .finally(async () => {
    await import("./mainApp.tsx");
  });
