import { MODIFIER_CARDS_DATA } from "../data/modifiers";
import { PACKS_DATA } from "../data/packs";
import { SPECIAL_CARDS_DATA } from "../data/specialCards";
import { TRADITIONAL_CARDS_DATA } from "../data/traditionalCards";

const CACHE_NAME = 'image-cache';

const getDefaultImageUrls = (): string[] => {
  const imageUrls: string[] = [];

  // Traditional cards
  Object.keys(TRADITIONAL_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
  });

  // Modifier cards
  Object.keys(MODIFIER_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/effect/${key}.png`);
  });

  // Special cards
  Object.keys(SPECIAL_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/effect/${key}.png`);
  });

  // Packs
  Object.keys(PACKS_DATA).forEach((key) => {
    imageUrls.push(`Cards/packs/${key}.png`);
  });

  // Backgrounds
  imageUrls.push("bg/game-bg.jpg");
  imageUrls.push("bg/home-bg.jpg");
  imageUrls.push("bg/store-bg.jpg");
  imageUrls.push("redirect/bg/store-bg.jpg");
  imageUrls.push("redirect/bg/game-bg.jpg");

  // Logos
  imageUrls.push("logos/jn-logo.png");
  imageUrls.push("logos/joker-logo.png");
  imageUrls.push("logos/logo-variant.svg");
  imageUrls.push("logos/logo.png");

  // Vfx
  imageUrls.push("vfx/explosion_blue.gif");
  imageUrls.push("vfx/glow_particle.gif");
  imageUrls.push("vfx/glow2.gif");
  imageUrls.push("vfx/holo.png");
  imageUrls.push("vfx/particle2.gif");
  imageUrls.push("vfx/sparkles.gif");

  return imageUrls;
};

export const preloadImages = async (urls?: string[]) => {
  const imageUrls: string[] = urls ?? getDefaultImageUrls();

  try {
    const cache = await caches.open(CACHE_NAME);

    const cachePromises = imageUrls.map(async (url) => {
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
    console.error('Error preloading images', error);
  }
};

export const getImageFromCache = async (url: string): Promise<Blob | null> => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    
    if (response) {
      return await response.blob();
    }
  } catch (error) {
    console.error('Error getting image from cache', error);
  }
  
  return null;
};