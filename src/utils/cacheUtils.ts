import { useConnect } from "@starknet-react/core";
import {
  CACHE_IMAGE_NAME,
  CACHE_VIDEO_NAME,
  getDefaultImageUrls,
} from "../constants/cacheUrls";
import {
  LOCAL_APP_VERSION,
  LOCAL_APP_VERSION_CHANGE,
  LOCAL_IMAGE_VERSION,
  LOCAL_VIDEO_VERSION,
} from "../constants/localStorage";
import { VIDEO_URLS } from "../constants/videoConstants";

const APP_ENV_VERSION = import.meta.env.VITE_APP_VERSION;
const IMAGE_ENV_VERSION = import.meta.env.VITE_IMAGE_VERSION;
const VIDEO_ENV_VERSION = import.meta.env.VITE_VIDEO_VERSION;

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
  console.log("Preloading images", imageUrls);
  try {
    await preloadMedia(CACHE_IMAGE_NAME, imageUrls);
  } catch (error) {
    console.error("Error preloading images", error);
  }
};

export const preloadVideos = async () => {
  try {
    await preloadMedia(CACHE_VIDEO_NAME, VIDEO_URLS);
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
  return getBlobFromCache(url, CACHE_IMAGE_NAME);
};

export const getVideoFromCache = async (
  url: string
): Promise<string | null> => {
  const blob = await getBlobFromCache(url, CACHE_VIDEO_NAME);
  if (blob) {
    return URL.createObjectURL(blob);
  }
  return null;
};

export const checkAndUpdateCacheVersions = async () => {
  const localAppVersion = localStorage.getItem(LOCAL_APP_VERSION);
  const localImageVersion = localStorage.getItem(LOCAL_IMAGE_VERSION);
  const localVideoVersion = localStorage.getItem(LOCAL_VIDEO_VERSION);
  const cacheNames = await caches.keys();

  if (localImageVersion !== IMAGE_ENV_VERSION) {
    await deleteMatchingCaches(
      `big-image-cache-${localImageVersion}`,
      cacheNames
    );
    localStorage.setItem(LOCAL_IMAGE_VERSION, IMAGE_ENV_VERSION);
  }

  if (localVideoVersion !== VIDEO_ENV_VERSION) {
    await deleteMatchingCaches(
      `background-video-cache-${localVideoVersion}`,
      cacheNames
    );
    localStorage.setItem(LOCAL_VIDEO_VERSION, VIDEO_ENV_VERSION);
  }

  if (localAppVersion !== APP_ENV_VERSION) {
    // localStorage.clear();
    // TODO: DELETE THE NECESSARY ITEMS FROM THE CACHE
    localStorage.setItem(LOCAL_APP_VERSION, APP_ENV_VERSION);
    if (localAppVersion) {
      localStorage.setItem(LOCAL_APP_VERSION_CHANGE, "true");
    }
  }
};

const deleteMatchingCaches = async (
  cacheName: string,
  cacheNames: string[]
) => {
  for (const name of cacheNames) {
    if (name === cacheName) {
      await caches.delete(name);
    }
  }
};
