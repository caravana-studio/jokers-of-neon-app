import { preloadSlotInstance } from "../config/cartridgeUrls";
import { preloadGameApiUrl } from "../config/gameApiUrl";
import { preloadCurrentSeasonId } from "../constants/season";
import { preloadManifest } from "../dojo/getManifest";

void Promise.all([
  preloadGameApiUrl(),
  preloadSlotInstance(),
  preloadManifest(),
  preloadCurrentSeasonId(),
])
  .catch((error) => {
    console.warn("[bootstrap] Failed to preload miniapp configuration.", error);
  })
  .finally(async () => {
    await import("./mainApp.tsx");
  });
