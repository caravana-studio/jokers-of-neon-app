import { normalizeShopUnlockableId } from "../constants/shopTierUnlock";
import {
  getPlayerTier,
  getUnlockList,
  UnlockEntryView,
} from "../dojo/queries/getShopUnlockProgress";

export type ShopTooltipItemKey =
  | "traditionalsNeon"
  | "modifiers"
  | "specials"
  | "powerups"
  | "levelups"
  | "lootboxes"
  | "burn";

export interface ShopTooltipItemEntry {
  key: ShopTooltipItemKey;
  count?: number;
}

type ShopTooltipTranslator = (
  key: string,
  params?: Record<string, unknown>
) => string;

const BASELINE_UNLOCKED_ITEMS: ShopTooltipItemKey[] = ["modifiers"];

const SHOPS_ITEMS: Record<number, ShopTooltipItemEntry[]> = {
  1: [
    { key: "traditionalsNeon", count: 5 },
    { key: "modifiers", count: 3 },
    { key: "burn" },
  ],
  2: [
    { key: "specials", count: 2 },
    { key: "powerups", count: 2 },
  ],
  3: [
    { key: "specials", count: 3 },
    { key: "lootboxes", count: 2 },
  ],
  4: [
    { key: "levelups", count: 3 },
    { key: "specials", count: 2 },
  ],
  5: [
    { key: "modifiers", count: 4 },
    { key: "lootboxes", count: 2 },
  ],
  6: [
    { key: "lootboxes", count: 2 },
    { key: "powerups", count: 2 },
    { key: "levelups", count: 3 },
  ],
};

const DEFAULT_SHOP_ITEMS = SHOPS_ITEMS[1];

const unlockIdToShopTooltipItemKey = (
  unlockId: string
): ShopTooltipItemKey | undefined => {
  const id = normalizeShopUnlockableId(unlockId);

  if (id.startsWith("specials_")) return "specials";
  if (id.startsWith("powerups_")) return "powerups";
  if (id.startsWith("modifiers_")) return "modifiers";
  if (id === "levelups") return "levelups";
  if (id === "lootboxes") return "lootboxes";
  if (id === "burn") return "burn";
  if (id === "traditionals" || id === "neon") return "traditionalsNeon";

  return undefined;
};

export const getShopTooltipUnlockTierByItem = (
  entries: UnlockEntryView[]
): Record<ShopTooltipItemKey, number> => {
  const tierByItem: Record<ShopTooltipItemKey, number> = {
    traditionalsNeon: Number.POSITIVE_INFINITY,
    modifiers: 0,
    specials: Number.POSITIVE_INFINITY,
    powerups: Number.POSITIVE_INFINITY,
    levelups: Number.POSITIVE_INFINITY,
    lootboxes: Number.POSITIVE_INFINITY,
    burn: Number.POSITIVE_INFINITY,
  };

  for (const entry of entries) {
    const itemKey = unlockIdToShopTooltipItemKey(entry.unlockId);
    if (!itemKey) continue;

    tierByItem[itemKey] = Math.min(tierByItem[itemKey], entry.order);
  }

  return tierByItem;
};

export const getUnlockedShopTooltipItems = (
  entries: UnlockEntryView[],
  playerTier: number
): Set<ShopTooltipItemKey> => {
  const tierByItem = getShopTooltipUnlockTierByItem(entries);
  const unlocked = new Set<ShopTooltipItemKey>(BASELINE_UNLOCKED_ITEMS);

  (Object.keys(tierByItem) as ShopTooltipItemKey[]).forEach((itemKey) => {
    if (tierByItem[itemKey] <= playerTier) {
      unlocked.add(itemKey);
    }
  });

  return unlocked;
};

export const getShopTooltipItems = (
  shopId: number,
  unlockedItems?: Set<ShopTooltipItemKey> | null
): ShopTooltipItemEntry[] => {
  const baseItems = SHOPS_ITEMS[shopId] ?? DEFAULT_SHOP_ITEMS;
  if (!unlockedItems) return baseItems;

  const visibleItems = baseItems.filter((item) => unlockedItems.has(item.key));
  return visibleItems.length > 0 ? visibleItems : baseItems;
};

export const buildShopTooltipContent = (
  shopId: number,
  t: ShopTooltipTranslator,
  unlockedItems?: Set<ShopTooltipItemKey> | null
): string => {
  const visibleItems = getShopTooltipItems(shopId, unlockedItems);
  return visibleItems
    .map((item) =>
      t(`items-content.${item.key}`, {
        count: item.count,
      })
    )
    .join(", ");
};

const getAddress = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "bigint") return `0x${value.toString(16)}`;
  if (value && typeof value === "object" && "toString" in value) {
    return (value as { toString: () => string }).toString();
  }
  return "";
};

const unlockSetPromiseCache = new Map<
  string,
  Promise<Set<ShopTooltipItemKey> | null>
>();

export const getUnlockedShopTooltipItemsForPlayer = async (
  client: any,
  accountAddress: unknown
): Promise<Set<ShopTooltipItemKey> | null> => {
  const playerAddress = getAddress(accountAddress);
  if (!client || !playerAddress) return null;

  const cacheKey = playerAddress.toLowerCase();
  const inFlight = unlockSetPromiseCache.get(cacheKey);
  if (inFlight) return inFlight;

  const request = Promise.all([
    getPlayerTier(client, playerAddress),
    getUnlockList(client),
  ])
    .then(([playerTier, unlockEntries]) => {
      const unlocked = getUnlockedShopTooltipItems(
        unlockEntries,
        playerTier.tier
      );
      unlockSetPromiseCache.delete(cacheKey);
      return unlocked;
    })
    .catch((error) => {
      console.error(
        "[shop-tooltip] failed to fetch unlock progress for player",
        error
      );
      unlockSetPromiseCache.delete(cacheKey);
      return null;
    });

  unlockSetPromiseCache.set(cacheKey, request);
  return request;
};
