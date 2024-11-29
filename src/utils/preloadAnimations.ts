import { LOOT_BOXES_DATA } from "../data/lootBoxes";

const CACHE_NAME = "spine-assets";

export const preloadSpineAnimations = async (
  basePath: string = "/spine-animations/"
): Promise<void> => {
  const ids = Object.keys(LOOT_BOXES_DATA).map(Number);
  try {
    const cache = await caches.open(CACHE_NAME);

    // Generate URLs for JSON and atlas files
    const animationUrls = ids.flatMap((id) => [
      `${basePath}loot_box_${id}.json`,
      `${basePath}loot_box_${id}.atlas`,
    ]);

    // Preload each animation URL
    const cachePromises = animationUrls.map(async (url) => {
      const cachedResponse = await cache.match(url);
      if (!cachedResponse) {
        // If not in cache, fetch and add to cache
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
