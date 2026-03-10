import {
  PactDefinition,
  ProfileProgress,
  ShopOffer,
  UpgradeDefinition,
  UnlockableSystem,
} from "./types";
import { isInitialTreeCompleted } from "./progression";

export const UPGRADE_DEFINITIONS: UpgradeDefinition[] = [
  {
    id: "upgrade_extra_play_c",
    name: "Tactical Draw",
    description: "+1 play al iniciar la run.",
    rarity: "C",
    scope: "PRE_RUN",
    cost: 1,
    effect: { kind: "PLAYS", value: 1 },
    unlock: { minRuns: 20, requiredSystems: ["PREPARE_RUN"] },
  },
  {
    id: "upgrade_extra_discard_c",
    name: "Measured Toss",
    description: "+1 discard al iniciar la run.",
    rarity: "C",
    scope: "PRE_RUN",
    cost: 1,
    effect: { kind: "DISCARDS", value: 1 },
    unlock: { minRuns: 20, requiredSystems: ["PREPARE_RUN"] },
  },
  {
    id: "upgrade_start_gold_c",
    name: "Pocket Neon",
    description: "+3 de oro inicial.",
    rarity: "C",
    scope: "PRE_RUN",
    cost: 1,
    effect: { kind: "START_GOLD", value: 3 },
    unlock: { minRuns: 21, requiredSystems: ["PREPARE_RUN"] },
  },
  {
    id: "upgrade_extra_play_b",
    name: "Quick Tempo",
    description: "+1 play adicional al iniciar la run.",
    rarity: "B",
    scope: "PRE_RUN",
    cost: 2,
    effect: { kind: "PLAYS", value: 1 },
    unlock: { minRuns: 24, requiredSystems: ["PREPARE_RUN"] },
  },
  {
    id: "upgrade_boss_focus_b",
    name: "Boss Instinct",
    description: "+1 temporary point extra por boss.",
    rarity: "B",
    scope: "PRE_RUN",
    cost: 2,
    effect: { kind: "BOSS_TEMP_POINTS", value: 1 },
    unlock: { minRuns: 25, requiredSystems: ["PREPARE_RUN"] },
  },
  {
    id: "upgrade_extra_discard_a",
    name: "Surgical Reset",
    description: "+2 discards al iniciar la run.",
    rarity: "A",
    scope: "PRE_RUN",
    cost: 3,
    effect: { kind: "DISCARDS", value: 2 },
    unlock: { minRuns: 28, requiredSystems: ["PREPARE_RUN"] },
  },
  {
    id: "upgrade_neon_bank_s",
    name: "Neon Reserve",
    description: "+6 de oro inicial.",
    rarity: "S",
    scope: "PRE_RUN",
    cost: 4,
    effect: { kind: "START_GOLD", value: 6 },
    unlock: { minRuns: 32, requiredSystems: ["PREPARE_RUN"] },
  },
  {
    id: "run_upgrade_extra_play",
    name: "Burst Play",
    description: "Durante esta run: +1 play total.",
    rarity: "C",
    scope: "RUN_TEMP",
    cost: 1,
    effect: { kind: "PLAYS", value: 1 },
    unlock: { minRuns: 1 },
  },
  {
    id: "run_upgrade_extra_discard",
    name: "Stabilize Hand",
    description: "Durante esta run: +1 discard total.",
    rarity: "C",
    scope: "RUN_TEMP",
    cost: 1,
    effect: { kind: "DISCARDS", value: 1 },
    unlock: { minRuns: 1 },
  },
  {
    id: "run_upgrade_boss_points",
    name: "Boss Echo",
    description: "Durante esta run: +1 temporary point extra por boss.",
    rarity: "B",
    scope: "RUN_TEMP",
    cost: 2,
    effect: { kind: "BOSS_TEMP_POINTS", value: 1 },
    unlock: { minRuns: 1 },
  },
];

export const PACT_DEFINITIONS: PactDefinition[] = [
  {
    id: "pact_fragile_hands",
    name: "Fragile Hands",
    description: "-1 discard inicial. Otorga 1 punto de loadout.",
    cost: -1,
    effect: { kind: "DISCARDS", value: -1 },
    unlock: { minRuns: 21, requiresInitialTreeCompletion: true },
  },
  {
    id: "pact_empty_pockets",
    name: "Empty Pockets",
    description: "-4 de oro inicial. Costo 0 puntos.",
    cost: 0,
    effect: { kind: "START_GOLD", value: -4 },
    unlock: { minRuns: 22, requiresInitialTreeCompletion: true },
  },
  {
    id: "pact_blind_push",
    name: "Blind Push",
    description: "-1 play inicial. Otorga 2 puntos de loadout.",
    cost: -2,
    effect: { kind: "PLAYS", value: -1 },
    unlock: { minRuns: 24, requiresInitialTreeCompletion: true },
  },
];

const DECK_TEMPLATE: Omit<ShopOffer, "id" | "purchased">[] = [
  {
    title: "Neon Pair",
    description: "Carta normal con buena sinergia temprana.",
    rarity: "C",
    price: 3,
  },
  {
    title: "Street Runner",
    description: "Carta normal barata para estabilizar mazo.",
    rarity: "C",
    price: 2,
  },
  {
    title: "Chrome Chain",
    description: "Carta normal de impacto medio.",
    rarity: "B",
    price: 4,
  },
  {
    title: "Pulse Ace",
    description: "Carta normal premium para escalado.",
    rarity: "A",
    price: 6,
  },
  {
    title: "Static Jack",
    description: "Carta normal agresiva de alto riesgo.",
    rarity: "B",
    price: 5,
  },
  {
    title: "Neon Drift",
    description: "Carta normal flexible para rounds largos.",
    rarity: "C",
    price: 3,
  },
];

export const getDeckOffersForRun = (runNumber: number): ShopOffer[] => {
  const offset = runNumber % DECK_TEMPLATE.length;
  const rotated = [
    ...DECK_TEMPLATE.slice(offset),
    ...DECK_TEMPLATE.slice(0, offset),
  ].slice(0, 4);

  return rotated.map((offer, index) => ({
    ...offer,
    id: `deck-${runNumber}-${index}`,
    purchased: false,
  }));
};

const hasAllSystems = (
  unlockedSystems: UnlockableSystem[],
  requiredSystems?: UnlockableSystem[]
): boolean => {
  if (!requiredSystems || requiredSystems.length === 0) {
    return true;
  }

  const unlockedSet = new Set(unlockedSystems);
  return requiredSystems.every((system) => unlockedSet.has(system));
};

export const getUnlockedPreRunUpgrades = (
  progress: ProfileProgress
): UpgradeDefinition[] => {
  return UPGRADE_DEFINITIONS.filter((upgrade) => {
    if (upgrade.scope !== "PRE_RUN") {
      return false;
    }

    const minRuns = upgrade.unlock.minRuns ?? 0;
    if (progress.totalRuns < minRuns) {
      return false;
    }

    return hasAllSystems(progress.unlockedSystems, upgrade.unlock.requiredSystems);
  });
};

export const getUnlockedRunUpgrades = (
  progress: ProfileProgress
): UpgradeDefinition[] => {
  return UPGRADE_DEFINITIONS.filter((upgrade) => {
    if (upgrade.scope !== "RUN_TEMP") {
      return false;
    }

    const minRuns = upgrade.unlock.minRuns ?? 0;
    return progress.totalRuns >= minRuns;
  });
};

export const getUnlockedPacts = (progress: ProfileProgress): PactDefinition[] => {
  const treeCompleted = isInitialTreeCompleted(progress.unlockedSystems);

  return PACT_DEFINITIONS.filter((pact) => {
    const minRuns = pact.unlock.minRuns ?? 0;
    if (progress.totalRuns < minRuns) {
      return false;
    }

    if (pact.unlock.requiresInitialTreeCompletion && !treeCompleted) {
      return false;
    }

    return true;
  });
};
