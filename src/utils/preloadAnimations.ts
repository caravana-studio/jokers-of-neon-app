const CACHE_NAME = "spine-assets";

export const preloadSpineAnimations = async (
  ids: number[] = Array.from({ length: 10 }, (_, i) => i + 1), // Default to 1-10
  basePath: string = "/spine-animations/"
): Promise<void> => {
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
          console.log(`Preloaded ${url}`);
        } else {
          console.warn(`Failed to preload ${url}`);
        }
      } else {
        console.log(`Cache hit for ${url}`);
      }
    });

    await Promise.all(cachePromises);
    console.log("All animations preloaded.");
  } catch (error) {
    console.error("Error preloading spine animations", error);
  }
};
