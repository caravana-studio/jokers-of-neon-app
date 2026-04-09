import { Intensity } from "../types/intensity";

export type ShopTierUnlockItemType =
  | "modifiers"
  | "specials"
  | "traditional-cards"
  | "power-ups"
  | "level-ups"
  | "loot-boxes"
  | "neon-cards"
  | "burn-card"
  | "slot"
  | "play"
  | "discard";

export type ShopTierUnlockRarity = "c" | "b" | "a" | "s" | "ba" | "cb" | "as";

export interface ShopTierUnlockConfig {
  unlockableId: string;
  itemType: ShopTierUnlockItemType;
  rarity?: ShopTierUnlockRarity;
  intensity: Intensity;
  imagePath: string;
  showRarity: boolean;
}

const SHOP_TIER_UNLOCK_CONFIG_BY_ID: Record<string, ShopTierUnlockConfig> = {
  specials_c: {
    unlockableId: "specials_c",
    itemType: "specials",
    rarity: "c",
    intensity: Intensity.LOW,
    imagePath: "/rogue/specials-c.png",
    showRarity: false,
  },
  powerups_cb: {
    unlockableId: "powerups_cb",
    itemType: "power-ups",
    rarity: "cb",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/powerups-cb.png",
    showRarity: false,
  },
  slot_2: {
    unlockableId: "slot_2",
    itemType: "slot",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/slot.png",
    showRarity: false,
  },
  play_4: {
    unlockableId: "play_4",
    itemType: "play",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/play.png",
    showRarity: false,
  },
  specials_b: {
    unlockableId: "specials_b",
    itemType: "specials",
    rarity: "b",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/specials-b.png",
    showRarity: true,
  },
  slot_3: {
    unlockableId: "slot_3",
    itemType: "slot",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/slot.png",
    showRarity: false,
  },
  modifiers_ba: {
    unlockableId: "modifiers_ba",
    itemType: "modifiers",
    rarity: "ba",
    intensity: Intensity.LOW,
    imagePath: "/rogue/modifiers-as.png",
    showRarity: true,
  },
  powerups_as: {
    unlockableId: "powerups_as",
    itemType: "power-ups",
    rarity: "as",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/powerups-as.png",
    showRarity: true,
  },
  slot_4: {
    unlockableId: "slot_4",
    itemType: "slot",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/slot.png",
    showRarity: false,
  },
  discard_4: {
    unlockableId: "discard_4",
    itemType: "discard",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/discard.png",
    showRarity: false,
  },
  levelups: {
    unlockableId: "levelups",
    itemType: "level-ups",
    rarity: "b",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/levelups.png",
    showRarity: false,
  },
  specials_a: {
    unlockableId: "specials_a",
    itemType: "specials",
    rarity: "a",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/specials-a.png",
    showRarity: true,
  },
  slot_5: {
    unlockableId: "slot_5",
    itemType: "slot",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/slot.png",
    showRarity: false,
  },
  traditionals: {
    unlockableId: "traditionals",
    itemType: "traditional-cards",
    rarity: "c",
    intensity: Intensity.LOW,
    imagePath: "/rogue/traditionals.png",
    showRarity: false,
  },
  play_5: {
    unlockableId: "play_5",
    itemType: "play",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/play.png",
    showRarity: false,
  },
  lootboxes: {
    unlockableId: "lootboxes",
    itemType: "loot-boxes",
    rarity: "a",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/lootboxes.png",
    showRarity: false,
  },
  neon: {
    unlockableId: "neon",
    itemType: "neon-cards",
    rarity: "a",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/neon.png",
    showRarity: false,
  },
  slot_6: {
    unlockableId: "slot_6",
    itemType: "slot",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/slot.png",
    showRarity: false,
  },
  burn: {
    unlockableId: "burn",
    itemType: "burn-card",
    rarity: "s",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/burn.png",
    showRarity: false,
  },
  discard_5: {
    unlockableId: "discard_5",
    itemType: "discard",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/discard.png",
    showRarity: false,
  },
  specials_s: {
    unlockableId: "specials_s",
    itemType: "specials",
    rarity: "s",
    intensity: Intensity.HIGH,
    imagePath: "/rogue/specials-s.png",
    showRarity: true,
  },
  slot_7: {
    unlockableId: "slot_7",
    itemType: "slot",
    intensity: Intensity.MEDIUM,
    imagePath: "/rogue/slot.png",
    showRarity: false,
  },
};

const LEGACY_TIER_ID_TO_UNLOCK_ID: Record<number, string> = {
  1: "modifiers_c",
  2: "specials_c",
  3: "traditionals",
  4: "modifiers_ba",
  5: "powerups_cb",
  6: "levelups",
  7: "specials_b",
  8: "lootboxes",
  9: "neon",
  10: "specials_a",
  11: "powerups_as",
  12: "specials_s",
  13: "burn",
  14: "play_4",
  15: "play_5",
  16: "discard_4",
  17: "discard_5",
};

export const normalizeShopUnlockableId = (unlockableId: string): string =>
  unlockableId.trim().toLowerCase().replaceAll("-", "_");

export const getShopUnlockIdFromLegacyTier = (
  legacyTierId: number
): string | undefined => LEGACY_TIER_ID_TO_UNLOCK_ID[legacyTierId];

export const getShopTierUnlockConfig = (
  unlockableId: string
): ShopTierUnlockConfig | undefined => {
  const normalizedUnlockableId = normalizeShopUnlockableId(unlockableId);
  return SHOP_TIER_UNLOCK_CONFIG_BY_ID[normalizedUnlockableId];
};

export const SHOP_TIER_UNLOCK_IDS = [
  "specials_c",
  "powerups_cb",
  "slot_2",
  "play_4",
  "specials_b",
  "slot_3",
  "modifiers_ba",
  "powerups_as",
  "slot_4",
  "discard_4",
  "levelups",
  "specials_a",
  "slot_5",
  "traditionals",
  "play_5",
  "lootboxes",
  "neon",
  "slot_6",
  "burn",
  "discard_5",
  "specials_s",
  "slot_7",
];
