import { MODIFIER_CARDS_DATA } from "../data/modifiers";
import { POWER_UPS_CARDS_DATA } from "../data/powerups";
import { SPECIAL_CARDS_DATA } from "../data/specialCards";
import {
  NEON_CARDS_DATA,
  TRADITIONAL_CARDS_DATA,
} from "../data/traditionalCards";

export const CACHE_IMAGE = "big-image-cache";
export const CACHE_VIDEO = "background-video-cache";

export const getDefaultImageUrls = async (): Promise<string[]> => {
  const imageUrls: string[] = [];

  Object.keys(TRADITIONAL_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
    imageUrls.push(`Cards/mobile/${key}.png`);
  });

  Object.keys(NEON_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
    imageUrls.push(`Cards/mobile/${key}.png`);
  });

  // Modifier cards
  Object.keys(MODIFIER_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
  });

  // Power-ups
  Object.keys(POWER_UPS_CARDS_DATA).forEach((key) => {
    imageUrls.push(`powerups/${key}.png`);
  });

  // Special cards
  Object.keys(SPECIAL_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
    imageUrls.push(`Cards/3d/${key}-l0.png`);
    imageUrls.push(`Cards/3d/${key}-l1.png`);
    imageUrls.push(`Cards/3d/${key}-l2.png`);
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

  // Borders
  imageUrls.push("borders/bottom.png");
  imageUrls.push("borders/bottom-rage.png");
  imageUrls.push("borders/top.png");
  imageUrls.push("borders/top-rage.png");

  // Sort
  imageUrls.push("sort/heart-on.png");
  imageUrls.push("sort/heart-off.png");
  imageUrls.push("sort/rank-on.png");
  imageUrls.push("sort/rank-off.png");

  // Slots
  imageUrls.push("store/locked-slot.png");
  imageUrls.push("store/slot-icon.png");
  imageUrls.push("store/slot-image.png");
  imageUrls.push("store/unlocked-slot.png");

  return imageUrls;
};

export const VIDEO_URLS = [
  "/bg/jn-bg.mp4",
  "/bg/store-bg.mp4",
  "/bg/game-bg.mp4",
  "/bg/rage-bg.mp4",
];
