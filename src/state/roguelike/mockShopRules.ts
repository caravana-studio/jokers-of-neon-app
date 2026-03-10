import { RARITY } from "../../constants/rarity";
import { getAvailableShopTabs } from "../../domain/roguelike/selectors";
import { ShopTabId, UnlockableSystem } from "../../domain/roguelike/types";

export interface StoreItemCounts {
  traditionals?: number;
  modifiers?: number;
  specials?: number;
  powerups?: number;
  lootboxes?: number;
  levelups?: number;
}

type StoreItemKey = keyof StoreItemCounts;

interface MockShopDefinition {
  id: number;
  name: string;
  primaryTab: ShopTabId;
  counts: StoreItemCounts;
}

const STORE_ITEM_KEYS: StoreItemKey[] = [
  "traditionals",
  "modifiers",
  "specials",
  "powerups",
  "lootboxes",
  "levelups",
];

const STORE_ITEM_REQUIRED_TAB: Record<StoreItemKey, ShopTabId> = {
  traditionals: "DECK",
  modifiers: "MODIFIERS",
  specials: "SPECIALS",
  powerups: "POWER_UPS",
  lootboxes: "LOOT_BOXES",
  levelups: "LEVEL_UPS",
};

const MOCK_SHOP_DEFINITIONS: MockShopDefinition[] = [
  {
    id: 1,
    name: "Deck",
    primaryTab: "DECK",
    counts: { traditionals: 5, modifiers: 3 },
  },
  {
    id: 2,
    name: "Global",
    primaryTab: "SPECIALS",
    counts: { specials: 2, powerups: 2 },
  },
  {
    id: 3,
    name: "Specials",
    primaryTab: "SPECIALS",
    counts: { specials: 3, lootboxes: 2 },
  },
  {
    id: 4,
    name: "Level Ups",
    primaryTab: "LEVEL_UPS",
    counts: { levelups: 3, specials: 2 },
  },
  {
    id: 5,
    name: "Modifiers",
    primaryTab: "MODIFIERS",
    counts: { modifiers: 4, lootboxes: 2 },
  },
  {
    id: 6,
    name: "Mix",
    primaryTab: "POWER_UPS",
    counts: { lootboxes: 2, powerups: 2, levelups: 3 },
  },
];

const hasTraditionalCardsUnlocked = (
  unlockedSystems: UnlockableSystem[]
): boolean => unlockedSystems.includes("TRADITIONAL_CARDS");

const getEnabledTabs = (unlockedSystems: UnlockableSystem[]): ShopTabId[] => {
  const tabs = getAvailableShopTabs(unlockedSystems);
  if (!tabs.includes("MODIFIERS")) {
    tabs.push("MODIFIERS");
  }
  return tabs;
};

const hasAnyItems = (counts: StoreItemCounts): boolean => {
  return STORE_ITEM_KEYS.some((key) => (counts[key] ?? 0) > 0);
};

const filterCountsByTabs = (
  counts: StoreItemCounts,
  unlockedSystems: UnlockableSystem[],
  enabledTabs: ShopTabId[]
): StoreItemCounts => {
  const traditionalsUnlocked = hasTraditionalCardsUnlocked(unlockedSystems);
  const next: StoreItemCounts = {};

  STORE_ITEM_KEYS.forEach((key) => {
    const baseCount = counts[key] ?? 0;
    const requiredTab = STORE_ITEM_REQUIRED_TAB[key];
    const tabEnabled = enabledTabs.includes(requiredTab);

    if (key === "traditionals") {
      next[key] = tabEnabled && traditionalsUnlocked ? baseCount : 0;
      return;
    }

    next[key] = tabEnabled ? baseCount : 0;
  });

  return next;
};

const getDefinitionById = (shopId: number): MockShopDefinition | undefined => {
  return MOCK_SHOP_DEFINITIONS.find((definition) => definition.id === shopId);
};

const getFallbackDefinition = (
  unlockedSystems: UnlockableSystem[],
  enabledTabs: ShopTabId[]
): MockShopDefinition => {
  return (
    MOCK_SHOP_DEFINITIONS.find((definition) => {
      const counts = filterCountsByTabs(
        definition.counts,
        unlockedSystems,
        enabledTabs
      );
      return hasAnyItems(counts);
    }) ?? MOCK_SHOP_DEFINITIONS[0]
  );
};

export const getMockShopName = (shopId: number): string => {
  return getDefinitionById(shopId)?.name ?? "Deck";
};

export const getAvailableMockShopIds = (
  unlockedSystems: UnlockableSystem[]
): number[] => {
  const enabledTabs = getEnabledTabs(unlockedSystems);

  return MOCK_SHOP_DEFINITIONS.filter((definition) => {
    if (!enabledTabs.includes(definition.primaryTab)) {
      return false;
    }

    const counts = filterCountsByTabs(
      definition.counts,
      unlockedSystems,
      enabledTabs
    );
    return hasAnyItems(counts);
  }).map((definition) => definition.id);
};

export const getMockShopItemCounts = (
  shopId: number,
  unlockedSystems: UnlockableSystem[]
): StoreItemCounts => {
  const enabledTabs = getEnabledTabs(unlockedSystems);
  const availableShopIds = new Set(getAvailableMockShopIds(unlockedSystems));
  const requestedDefinition = getDefinitionById(shopId);

  const selectedDefinition =
    requestedDefinition && availableShopIds.has(shopId)
      ? requestedDefinition
      : getFallbackDefinition(unlockedSystems, enabledTabs);

  return filterCountsByTabs(selectedDefinition.counts, unlockedSystems, enabledTabs);
};

export const getAllowedModifierRarities = (
  unlockedSystems: UnlockableSystem[]
): RARITY[] => {
  const allowed = new Set<RARITY>([RARITY.B]);

  if (unlockedSystems.includes("MODIFIERS_C")) {
    allowed.add(RARITY.C);
  }

  if (unlockedSystems.includes("MODIFIERS_BA")) {
    allowed.add(RARITY.A);
  }

  if (unlockedSystems.includes("SPECIALS_S")) {
    allowed.add(RARITY.S);
  }

  return Array.from(allowed);
};

export const isBurnUnlocked = (
  unlockedSystems: UnlockableSystem[]
): boolean => {
  return hasTraditionalCardsUnlocked(unlockedSystems);
};
