const VIDEO_CACHE_NAME = "background-video-cache";

const videoSources = {
  home: "/bg/jn-bg.mp4",
  store: "/bg/store-bg.mp4",
  game: "/bg/game-bg.mp4",
  rage: "/bg/rage-bg.mp4",
};

export const preloadVideos = async () => {
  try {
    const cache = await caches.open(VIDEO_CACHE_NAME);

    await Promise.all(
      Object.values(videoSources).map(async (url) => {
        const cachedResponse = await cache.match(url);
        if (!cachedResponse) {
          try {
            const response = await fetch(url, { cache: "reload" });
            if (response.ok) {
              await cache.put(url, response.clone());
            }
          } catch {
            console.warn(`Failed to cache video: ${url}`);
          }
        }
      })
    );
  } catch (error) {
    console.error("Error preloading videos", error);
  }
};

export const getVideoFromCache = async (
  url: string
): Promise<string | null> => {
  try {
    const cache = await caches.open(VIDEO_CACHE_NAME);
    const response = await cache.match(url);

    if (response) {
      return URL.createObjectURL(await response.blob());
    }
  } catch (error) {
    console.error("Error getting video from cache", error);
  }

  return null;
};
