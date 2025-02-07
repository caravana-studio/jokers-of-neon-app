import {
  CACHE_IMAGE,
  CACHE_VIDEO,
  VIDEO_URLS,
  getDefaultImageUrls,
} from "../constants/cacheUrls";

const preloadMedia = async (cacheName: string, urls: string[]) => {
  try {
    const cache = await caches.open(cacheName);

    const cachePromises = urls.map(async (url) => {
      const cachedResponse = await cache.match(url);
      if (!cachedResponse) {
        // If not in cache, fetch and add to cache
        try {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) {
            await cache.put(url, response.clone());
          }
        } catch {
          // if the image doesn't exist, just ignore it
        }
      }
    });

    await Promise.all(cachePromises);
  } catch (error) {
    console.error("Error in cache", error);
  }
};

export const preloadImages = async (urls?: string[]) => {
  const imageUrls: string[] = urls ?? (await getDefaultImageUrls());
  try {
    await preloadMedia(CACHE_IMAGE, imageUrls);
  } catch (error) {
    console.error("Error preloading images", error);
  }
};

export const preloadVideos = async () => {
  try {
    await preloadMedia(CACHE_VIDEO, VIDEO_URLS);
  } catch (error) {
    console.error("Error preloading video", error);
  }
};

const getBlobFromCache = async (
  url: string,
  cacheName: string
): Promise<Blob | null> => {
  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(url);

    if (response) {
      return await response.blob();
    }
  } catch (error) {
    console.error("Error getting image from cache", error);
  }

  return null;
};

export const getImageFromCache = async (url: string): Promise<Blob | null> => {
  return getBlobFromCache(url, CACHE_IMAGE);
};

export const getVideoFromCache = async (
  url: string
): Promise<string | null> => {
  const blob = await getBlobFromCache(url, CACHE_IMAGE);
  if (blob) {
    return URL.createObjectURL(blob);
  }
  return null;
};
