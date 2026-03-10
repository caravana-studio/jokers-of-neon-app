export const RARITIES = ["C", "B", "A", "S"] as const;
export type Rarity = (typeof RARITIES)[number];

export const UNLOCKABLE_SYSTEMS = [
  "TRADITIONAL_CARDS",
  "MODIFIERS_C",
  "SPECIALS_C",
  "MODIFIERS_BA",
  "POWER_UPS_CB",
  "LEVEL_UPS",
  "SPECIALS_B",
  "LOOT_BOXES",
  "NEON_CARDS",
  "SPECIALS_A",
  "POWER_UPS_AS",
  "SPECIALS_S",
  "PREPARE_RUN",
] as const;

export type UnlockableSystem = (typeof UNLOCKABLE_SYSTEMS)[number];

export const SHOP_TAB_IDS = [
  "DECK",
  "MODIFIERS",
  "SPECIALS",
  "POWER_UPS",
  "LEVEL_UPS",
  "LOOT_BOXES",
  "NEON",
] as const;

export type ShopTabId = (typeof SHOP_TAB_IDS)[number];

export type RunResult = "WIN" | "LOSS";

export interface UnlockCondition {
  minRun: number;
  minRound: number;
}

export interface UnlockRule {
  system: UnlockableSystem;
  title: string;
  description: string;
  condition: UnlockCondition;
}

export interface QueuedUnlock {
  system: UnlockableSystem;
  title: string;
  description: string;
  unlockedAtRun: number;
  unlockedAtRound: number;
}

export interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  scope: "PRE_RUN" | "RUN_TEMP";
  cost: number;
  unlock: {
    minRuns?: number;
    requiredSystems?: UnlockableSystem[];
  };
  effect?: {
    kind: "PLAYS" | "DISCARDS" | "START_GOLD" | "BOSS_TEMP_POINTS";
    value: number;
  };
}

export interface PactDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect?: {
    kind: "PLAYS" | "DISCARDS" | "START_GOLD";
    value: number;
  };
  unlock: {
    minRuns?: number;
    requiresInitialTreeCompletion: boolean;
  };
}

export interface LoadoutSelection {
  selectedUpgradeIds: string[];
  selectedPactIds: string[];
}

export interface RunConfig {
  loadout: LoadoutSelection;
}

export interface BossReward {
  bossId: string;
  round: number;
  temporaryPoints: number;
}

export interface ShopOffer {
  id: string;
  title: string;
  description: string;
  rarity: Rarity;
  price: number;
  purchased: boolean;
}

export interface ShopState {
  runId: string;
  availableTabs: ShopTabId[];
  offersByTab: Partial<Record<ShopTabId, ShopOffer[]>>;
}

export interface ActiveRun {
  runId: string;
  runNumber: number;
  currentRound: number;
  highestRoundReached: number;
  totalPlays: number;
  totalDiscards: number;
  remainingPlays: number;
  remainingDiscards: number;
  temporaryPoints: number;
  selectedUpgradeIds: string[];
  selectedPactIds: string[];
  temporaryUpgradeIds: string[];
  bossRewards: BossReward[];
  gold: number;
}

export interface ProfileProgress {
  totalRuns: number;
  highestRoundEver: number;
  unlockedSystems: UnlockableSystem[];
  unlockedUpgradeIds: string[];
  unlockedPactIds: string[];
  pointCap: number;
  pendingUnlocks: QueuedUnlock[];
}

export interface EndRunInput {
  result: RunResult;
  highestRoundReached: number;
}

export interface EndRunResult {
  progress: ProfileProgress;
  awardedUnlock: QueuedUnlock | null;
}

export interface BuyCardInput {
  runId: string;
  offerId: string;
  tab: ShopTabId;
}

export interface BuyCardResult {
  run: ActiveRun;
  shop: ShopState;
}
