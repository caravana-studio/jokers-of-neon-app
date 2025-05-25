import { MODIFIERS_RARITY } from "../data/modifiers";
import { POWER_UP_KEYS } from "../data/powerups";
import { RAGES_RARITY } from "../data/rageCards";
import { SPECIALS_RARITY } from "../data/specialCards";
import { CARDS_SUIT_DATA } from "../data/traditionalCards";

export const CACHE_IMAGE = "big-image-cache-2";
export const CACHE_VIDEO = "background-video-cache";

export const getDefaultImageUrls = async (): Promise<string[]> => {
  const imageUrls: string[] = [];

  Object.keys(CARDS_SUIT_DATA).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
    imageUrls.push(`Cards/mobile/${key}.png`);
  });

  // Modifier cards
  Object.keys(MODIFIERS_RARITY).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
  });

  // Power-ups
  POWER_UP_KEYS.forEach((key) => {
    imageUrls.push(`powerups/${key}.png`);
  });

  // Special cards
  Object.keys(SPECIALS_RARITY).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
    imageUrls.push(`Cards/3d/${key}-l0.png`);
    imageUrls.push(`Cards/3d/${key}-l1.png`);
    imageUrls.push(`Cards/3d/${key}-l2.png`);
    imageUrls.push(`Cards/3d/${key}-l3.png`);
  });

  // Rage cards
  Object.keys(RAGES_RARITY).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
    imageUrls.push(`Cards/3d/${key}-l0.png`);
    imageUrls.push(`Cards/3d/${key}-l1.png`);
    imageUrls.push(`Cards/3d/${key}-l2.png`);
    imageUrls.push(`Cards/3d/${key}-l3.png`);
  });

  // Backgrounds
  const bgImages = import.meta.glob("/public/bg/**/*.png", {
    eager: true,
  });
  const redirectImages = import.meta.glob("/public/redirect/**/*.png", {
    eager: true,
  });

  imageUrls.push(...extractImageUrls(bgImages));
  imageUrls.push(...extractImageUrls(redirectImages));

  // Logos
  const logoImages = import.meta.glob("/public/logos/**/*.png", {
    eager: true,
  });
  imageUrls.push(...extractImageUrls(logoImages));

  // Mods
  imageUrls.push("mods/classic.png");
  imageUrls.push("mods/loot-survivor.png");

  // Borders
  const bordersImages = import.meta.glob("/public/borders/**/*.png", {
    eager: true,
  });
  imageUrls.push(...extractImageUrls(bordersImages));

  // Sort
  const sortImages = import.meta.glob("/public/sort/**/*.png", {
    eager: true,
  });
  imageUrls.push(...extractImageUrls(sortImages));

  // Store
  const storeImages = import.meta.glob("/public/store/**/*.png", {
    eager: true,
  });
  imageUrls.push(...extractImageUrls(storeImages));

  // specials-box
  const specialsBoxImages = import.meta.glob("/public/specials-box/**/*.png", {
    eager: true,
  });
  imageUrls.push(...extractImageUrls(specialsBoxImages));

  // Backs
  const backsImages = import.meta.glob("/public/Cards/Backs/**/*.png", {
    eager: true,
  });
  imageUrls.push(...extractImageUrls(backsImages));

  // others
  imageUrls.push("broken.png");
  imageUrls.push("deck-icon.png");
  imageUrls.push("grid.png");
  imageUrls.push("icon.png");
  imageUrls.push("loader.gif");

  // map
  const mapImages = import.meta.glob("/public/map/**/*.png", {
    eager: true,
  });

  imageUrls.push(...extractImageUrls(mapImages));

  // assets
  const assetsImages = import.meta.glob("/src/assets/**/*.png", {
    eager: true,
  });

  imageUrls.push(...extractImageUrls(assetsImages));

  return imageUrls;
};

function extractImageUrls(
  mapImages: Record<string, any>,
  basePath = "/public/"
): string[] {
  return Object.keys(mapImages).map((key) => key.replace(basePath, ""));
}

export const VIDEO_URLS = [
  "/bg/jn-bg.mp4",
  "/bg/store-bg.mp4",
  "/bg/game-bg.mp4",
  "/bg/rage-bg.mp4",
  "/bg/map-bg.mp4",
];
