import {
  SPINE_BASE_PATH,
  getSpineBoxFiles,
  getSpineLogoPaths,
  getSpinePhoenixPaths,
} from "../constants/spineConstants";
import { BOXES_RARITY } from "../data/lootBoxes";

const CACHE_NAME = "spine-assets";

export const preloadSpineAnimations = async (
  basePath: string = SPINE_BASE_PATH
): Promise<void> => {
  const ids = Object.keys(BOXES_RARITY).map(Number);
  try {
    const cache = await caches.open(CACHE_NAME);

    const spineUrls = [
      ...getSpineBoxFiles(ids, basePath),
      ...getSpineLogoPaths(basePath),
      ...getSpinePhoenixPaths(basePath),
    ];

    const cachePromises = spineUrls.map(async (url) => {
      const cachedResponse = await cache.match(url);
      if (!cachedResponse) {
        const response = await fetch(url, { cache: "reload" });
        if (response.ok) {
          await cache.put(url, response.clone());
        } else {
          console.warn(`Failed to preload ${url}`);
        }
      }
    });

    await Promise.all(cachePromises);
  } catch (error) {
    console.error("Error preloading spine animations", error);
  }
};
