import { MODIFIERS_RARITY } from "../data/modifiers";
import { POWER_UP_KEYS } from "../data/powerups";
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

  // Mods
  imageUrls.push("mods/classic.png");
  imageUrls.push("mods/loot-survivor.png");

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

  // specials-box
  imageUrls.push("specials-box/rage-icon-off.png");
  imageUrls.push("specials-box/rage-icon-on.png");
  imageUrls.push("specials-box/special-icon-off.png");
  imageUrls.push("specials-box/special-icon-on.png");

  // store
  imageUrls.push("store/locked-slot.png");
  imageUrls.push("store/slot-icon.png");
  imageUrls.push("store/slot-image.png");
  imageUrls.push("store/unlocked-slot.png");

  // Backs
  imageUrls.push("Cards/Backs/back-empty.png");
  imageUrls.push("Cards/Backs/back-full.png");
  imageUrls.push("Cards/Backs/back-mid.png");
  imageUrls.push("Cards/Backs/back.png");

  // others
  imageUrls.push("broken.png");
  imageUrls.push("deck-icon.png");
  imageUrls.push("grid.png");
  imageUrls.push("icon.png");
  imageUrls.push("loader.gif");

  // map
  // - rage
  imageUrls.push("map/icons/rage/final-blue-bordered.png");
  imageUrls.push("map/icons/rage/final-blue.png");
  imageUrls.push("map/icons/rage/final-off.png");
  imageUrls.push("map/icons/rage/final-violet-bordered.png");
  imageUrls.push("map/icons/rage/final-violet.png");
  imageUrls.push("map/icons/rage/intermediate-blue-bordered.png");
  imageUrls.push("map/icons/rage/intermediate-blue.png");
  imageUrls.push("map/icons/rage/intermediate-off.png");
  imageUrls.push("map/icons/rage/intermediate-violet-bordered.png");
  imageUrls.push("map/icons/rage/intermediate-violet.png");
  // - rewards
  imageUrls.push("map/icons/rewards/1-off.png");
  imageUrls.push("map/icons/rewards/1.png");
  imageUrls.push("map/icons/rewards/2-off.png");
  imageUrls.push("map/icons/rewards/2.png");
  imageUrls.push("map/icons/rewards/3-off.png");
  imageUrls.push("map/icons/rewards/3.png");
  imageUrls.push("map/icons/rewards/4-off.png");
  imageUrls.push("map/icons/rewards/4.png");
  imageUrls.push("map/icons/rewards/5-off.png");
  imageUrls.push("map/icons/rewards/5.png");
  imageUrls.push("map/icons/rewards/6-off.png");
  imageUrls.push("map/icons/rewards/6.png");
  // - round
  imageUrls.push("map/icons/round/round.png");
  imageUrls.push("map/icons/round/round-off.png");


  return imageUrls;
};

export const VIDEO_URLS = [
  "/bg/jn-bg.mp4",
  "/bg/store-bg.mp4",
  "/bg/game-bg.mp4",
  "/bg/rage-bg.mp4",
  "/bg/map-bg.mp4",
];
