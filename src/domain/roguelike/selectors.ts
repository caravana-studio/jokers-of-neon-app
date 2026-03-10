import { isInitialTreeCompleted } from "./progression";
import { ShopTabId, UnlockableSystem } from "./types";

export const isSystemUnlocked = (
  unlockedSystems: UnlockableSystem[],
  system: UnlockableSystem
): boolean => unlockedSystems.includes(system);

export const isPrepareRunUnlocked = (
  unlockedSystems: UnlockableSystem[]
): boolean => isSystemUnlocked(unlockedSystems, "PREPARE_RUN");

export const arePactsEnabled = (unlockedSystems: UnlockableSystem[]): boolean =>
  isInitialTreeCompleted(unlockedSystems);

export const getAvailableShopTabs = (
  unlockedSystems: UnlockableSystem[]
): ShopTabId[] => {
  const tabs: ShopTabId[] = ["DECK"];

  if (
    unlockedSystems.includes("MODIFIERS_C") ||
    unlockedSystems.includes("MODIFIERS_BA")
  ) {
    tabs.push("MODIFIERS");
  }

  if (
    unlockedSystems.includes("SPECIALS_C") ||
    unlockedSystems.includes("SPECIALS_B") ||
    unlockedSystems.includes("SPECIALS_A") ||
    unlockedSystems.includes("SPECIALS_S")
  ) {
    tabs.push("SPECIALS");
  }

  if (
    unlockedSystems.includes("POWER_UPS_CB") ||
    unlockedSystems.includes("POWER_UPS_AS")
  ) {
    tabs.push("POWER_UPS");
  }

  if (unlockedSystems.includes("LEVEL_UPS")) {
    tabs.push("LEVEL_UPS");
  }

  if (unlockedSystems.includes("LOOT_BOXES")) {
    tabs.push("LOOT_BOXES");
  }

  if (unlockedSystems.includes("NEON_CARDS")) {
    tabs.push("NEON");
  }

  return tabs;
};

export const SHOP_TAB_LABELS: Record<ShopTabId, string> = {
  DECK: "Deck",
  MODIFIERS: "Modifiers",
  SPECIALS: "Specials",
  POWER_UPS: "Power Ups",
  LEVEL_UPS: "Level Ups",
  LOOT_BOXES: "Loot Boxes",
  NEON: "Neon",
};
