const CACHE_NAME = "spine-assets";

export const saveToCache = async (
  url: string,
  cacheName: string = CACHE_NAME
): Promise<void> => {
  try {
    const cache = await caches.open(cacheName);
    const response = await fetch(url);

    if (response.ok) {
      await cache.put(url, response.clone()); // Clone the response before putting it into the cache
    } else {
      console.error(
        `Failed to fetch ${url} for caching. Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error(`Error while saving ${url} to cache:`, error);
  }
};

export const getFromCacheOrFetch = async (
  url: string,
  cacheName: string = "spine-assets"
): Promise<Response> => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(url);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(url);
  if (response.ok) {
    await cache.put(url, response.clone());
  }
  return response;
};
