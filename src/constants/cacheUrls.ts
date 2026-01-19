import { MODIFIERS_RARITY } from "../data/modifiers";
import { POWER_UP_KEYS } from "../data/powerups";
import { RAGES_RARITY } from "../data/rageCards";
import { SPECIALS_RARITY } from "../data/specialCards";
import { CARDS_SUIT_DATA } from "../data/traditionalCards";
import { ALL_GLOBS, STATIC_IMAGE_URLS } from "./imageConstants";

export const CACHE_IMAGE = "big-image-cache-s1";
export const CACHE_VIDEO = "background-video-cache";

export const getDefaultImageUrls = async (): Promise<string[]> => {
  const imageUrls: string[] = [...STATIC_IMAGE_URLS];

  // Suit cards
  Object.keys(CARDS_SUIT_DATA).forEach((key) => {
    imageUrls.push(`/Cards/${key}.png`);
    imageUrls.push(`/Cards/mobile/${key}.png`);
  });

  // Modifier cards
  Object.keys(MODIFIERS_RARITY).forEach((key) => {
    imageUrls.push(`/Cards/${key}.png`);
  });

  // Power-ups
  POWER_UP_KEYS.forEach((key) => {
    imageUrls.push(`/powerups/${key}.png`);
  });

  // Special & Rage cards
  [SPECIALS_RARITY, RAGES_RARITY].forEach((rarityGroup) => {
    Object.keys(rarityGroup).forEach((key) => {
      imageUrls.push(`/Cards/${key}.png`);
      for (let level = 0; level <= 3; level++) {
        imageUrls.push(`/Cards/3d/${key}-l${level}.png`);
      }
    });
  });

  imageUrls.push(...preloadGlobImages(ALL_GLOBS));

  return imageUrls;
};

export const extractImageUrls = (globbed: Record<string, unknown>) => {
  return Object.keys(globbed).map((key) => key.replace("/public/", ""));
};

export const preloadGlobImages = (globs: any): string[] => {
  const urls: string[] = [];

  Object.values(globs).forEach((files) => {
    urls.push(...extractImageUrls(files as any));
  });
  return urls;
};
