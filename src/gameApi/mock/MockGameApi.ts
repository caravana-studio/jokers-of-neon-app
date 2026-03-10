import { ROGUELIKE_POC_STATE } from "../../constants/localStorage";
import {
  getDeckOffersForRun,
  getUnlockedPacts,
  getUnlockedPreRunUpgrades,
  getUnlockedRunUpgrades,
  UPGRADE_DEFINITIONS,
} from "../../domain/roguelike/catalog";
import {
  calculateLoadoutCost,
  selectPacts,
  selectUpgrades,
  sumPactEffect,
  sumUpgradeEffect,
} from "../../domain/roguelike/loadout";
import {
  BASE_START_GOLD,
  BASE_TOTAL_DISCARDS,
  BASE_TOTAL_PLAYS,
  computePointCap,
  getNextUnlockRule,
} from "../../domain/roguelike/progression";
import { getAvailableShopTabs } from "../../domain/roguelike/selectors";
import {
  ActiveRun,
  BossReward,
  BuyCardInput,
  BuyCardResult,
  EndRunInput,
  EndRunResult,
  PactDefinition,
  ProfileProgress,
  QueuedUnlock,
  RunConfig,
  ShopState,
  UpgradeDefinition,
} from "../../domain/roguelike/types";
import { GameApi } from "../GameApi";

interface MockPersistedState {
  profile: ProfileProgress;
  activeRun: ActiveRun | null;
  activeShop: ShopState | null;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const createDefaultProfile = (): ProfileProgress => ({
  totalRuns: 0,
  highestRoundEver: 0,
  unlockedSystems: [],
  unlockedUpgradeIds: [],
  unlockedPactIds: [],
  pointCap: 0,
  pendingUnlocks: [],
});

const createDefaultState = (): MockPersistedState => ({
  profile: createDefaultProfile(),
  activeRun: null,
  activeShop: null,
});

const normalizeProfile = (profile: ProfileProgress): ProfileProgress => {
  const normalized = clone(profile);

  normalized.pointCap = computePointCap(
    normalized.totalRuns,
    normalized.unlockedSystems
  );

  const unlockedPreRun = getUnlockedPreRunUpgrades(normalized);
  const unlockedRun = getUnlockedRunUpgrades(normalized);
  const unlockedPacts = getUnlockedPacts(normalized);

  normalized.unlockedUpgradeIds = [
    ...unlockedPreRun.map((upgrade) => upgrade.id),
    ...unlockedRun.map((upgrade) => upgrade.id),
  ];
  normalized.unlockedPactIds = unlockedPacts.map((pact) => pact.id);

  return normalized;
};

const safeReadLocalStorage = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ROGUELIKE_POC_STATE);
};

const safeWriteLocalStorage = (value: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ROGUELIKE_POC_STATE, value);
};

const toUpgradeMap = (upgrades: UpgradeDefinition[]): Map<string, UpgradeDefinition> =>
  new Map(upgrades.map((upgrade) => [upgrade.id, upgrade]));

const toPactMap = (pacts: PactDefinition[]): Map<string, PactDefinition> =>
  new Map(pacts.map((pact) => [pact.id, pact]));

const RUN_UPGRADE_MAP = toUpgradeMap(
  UPGRADE_DEFINITIONS.filter((upgrade) => upgrade.scope === "RUN_TEMP")
);

export class MockGameApi implements GameApi {
  private state: MockPersistedState;

  constructor() {
    const raw = safeReadLocalStorage();

    if (!raw) {
      this.state = createDefaultState();
      this.state.profile = normalizeProfile(this.state.profile);
      this.persist();
      return;
    }

    try {
      const parsed = JSON.parse(raw) as MockPersistedState;
      this.state = {
        ...createDefaultState(),
        ...parsed,
        profile: normalizeProfile(parsed.profile ?? createDefaultProfile()),
      };
      this.persist();
    } catch {
      this.state = createDefaultState();
      this.state.profile = normalizeProfile(this.state.profile);
      this.persist();
    }
  }

  async getProfile(): Promise<ProfileProgress> {
    return clone(this.state.profile);
  }

  async getProgress(): Promise<ProfileProgress> {
    return clone(this.state.profile);
  }

  async getActiveRun(): Promise<ActiveRun | null> {
    return clone(this.state.activeRun);
  }

  async startRun(config: RunConfig): Promise<ActiveRun> {
    const profile = normalizeProfile(this.state.profile);
    this.state.profile = profile;

    const prepareRunUnlocked = profile.unlockedSystems.includes("PREPARE_RUN");
    const availablePreRunUpgrades = getUnlockedPreRunUpgrades(profile);
    const availablePacts = getUnlockedPacts(profile);

    const preRunUpgradeMap = toUpgradeMap(availablePreRunUpgrades);
    const pactMap = toPactMap(availablePacts);

    const requestedLoadout = prepareRunUnlocked
      ? config.loadout
      : { selectedUpgradeIds: [], selectedPactIds: [] };

    const selectedUpgradeIds = Array.from(
      new Set(
        requestedLoadout.selectedUpgradeIds.filter((id) =>
          preRunUpgradeMap.has(id)
        )
      )
    );
    const selectedPactIds = Array.from(
      new Set(
        requestedLoadout.selectedPactIds.filter((id) => pactMap.has(id))
      )
    );

    const selectedUpgrades = selectUpgrades(
      selectedUpgradeIds,
      availablePreRunUpgrades
    );
    const selectedPacts = selectPacts(selectedPactIds, availablePacts);

    const loadoutCost = calculateLoadoutCost(
      { selectedUpgradeIds, selectedPactIds },
      availablePreRunUpgrades,
      availablePacts
    );

    if (prepareRunUnlocked && loadoutCost > profile.pointCap) {
      throw new Error("Loadout cost exceeds available points.");
    }

    const totalPlays = Math.max(
      1,
      BASE_TOTAL_PLAYS +
        sumUpgradeEffect(selectedUpgrades, "PLAYS") +
        sumPactEffect(selectedPacts, "PLAYS")
    );
    const totalDiscards = Math.max(
      1,
      BASE_TOTAL_DISCARDS +
        sumUpgradeEffect(selectedUpgrades, "DISCARDS") +
        sumPactEffect(selectedPacts, "DISCARDS")
    );
    const startingGold = Math.max(
      0,
      BASE_START_GOLD +
        sumUpgradeEffect(selectedUpgrades, "START_GOLD") +
        sumPactEffect(selectedPacts, "START_GOLD")
    );

    const runNumber = profile.totalRuns + 1;
    const runId = `run-${runNumber}-${Date.now()}`;
    const shop = this.buildShop(runId, runNumber, profile.unlockedSystems);

    const run: ActiveRun = {
      runId,
      runNumber,
      currentRound: 1,
      highestRoundReached: 1,
      totalPlays,
      totalDiscards,
      remainingPlays: totalPlays,
      remainingDiscards: totalDiscards,
      temporaryPoints: 0,
      selectedUpgradeIds,
      selectedPactIds,
      temporaryUpgradeIds: [],
      bossRewards: [],
      gold: startingGold,
    };

    this.state.activeRun = run;
    this.state.activeShop = shop;
    this.persist();

    return clone(run);
  }

  async advanceRound(runId: string): Promise<ActiveRun> {
    const run = this.assertActiveRun(runId);

    run.currentRound += 1;
    run.highestRoundReached = Math.max(run.highestRoundReached, run.currentRound);
    run.remainingPlays = run.totalPlays;
    run.remainingDiscards = run.totalDiscards;

    this.state.activeRun = run;
    this.persist();

    return clone(run);
  }

  async defeatBoss(runId: string): Promise<ActiveRun> {
    const run = this.assertActiveRun(runId);

    const alreadyDefeated = run.bossRewards.some(
      (reward) => reward.round === run.currentRound
    );

    if (alreadyDefeated) {
      return clone(run);
    }

    const allUpgradeIds = [...run.selectedUpgradeIds, ...run.temporaryUpgradeIds];
    const bossPointBonus = allUpgradeIds
      .map((upgradeId) => UPGRADE_DEFINITIONS.find((upgrade) => upgrade.id === upgradeId))
      .filter((upgrade): upgrade is UpgradeDefinition => upgrade !== undefined)
      .reduce((accumulator, upgrade) => {
        if (!upgrade.effect || upgrade.effect.kind !== "BOSS_TEMP_POINTS") {
          return accumulator;
        }

        return accumulator + upgrade.effect.value;
      }, 0);

    const rewardPoints = Math.max(1, 1 + bossPointBonus);

    const reward: BossReward = {
      bossId: `boss-${run.currentRound}`,
      round: run.currentRound,
      temporaryPoints: rewardPoints,
    };

    run.bossRewards.push(reward);
    run.temporaryPoints += rewardPoints;

    this.state.activeRun = run;
    this.persist();

    return clone(run);
  }

  async buyRunUpgrade(runId: string, upgradeId: string): Promise<ActiveRun> {
    const run = this.assertActiveRun(runId);
    const profile = this.state.profile;

    if (run.temporaryUpgradeIds.includes(upgradeId)) {
      return clone(run);
    }

    const upgrade = RUN_UPGRADE_MAP.get(upgradeId);
    if (!upgrade) {
      throw new Error("Unknown run upgrade.");
    }

    if (!profile.unlockedUpgradeIds.includes(upgradeId)) {
      throw new Error("Run upgrade is not unlocked yet.");
    }

    if (run.temporaryPoints < upgrade.cost) {
      throw new Error("Not enough temporary points.");
    }

    run.temporaryPoints -= upgrade.cost;
    run.temporaryUpgradeIds.push(upgradeId);

    if (upgrade.effect?.kind === "PLAYS") {
      run.totalPlays = Math.max(1, run.totalPlays + upgrade.effect.value);
      run.remainingPlays = Math.max(0, run.remainingPlays + upgrade.effect.value);
    }

    if (upgrade.effect?.kind === "DISCARDS") {
      run.totalDiscards = Math.max(1, run.totalDiscards + upgrade.effect.value);
      run.remainingDiscards = Math.max(
        0,
        run.remainingDiscards + upgrade.effect.value
      );
    }

    this.state.activeRun = run;
    this.persist();

    return clone(run);
  }

  async setRunGold(runId: string, gold: number): Promise<ActiveRun> {
    const run = this.assertActiveRun(runId);

    run.gold = Math.max(0, Math.floor(gold));

    this.state.activeRun = run;
    this.persist();

    return clone(run);
  }

  async getShop(runId: string): Promise<ShopState> {
    this.assertActiveRun(runId);
    if (!this.state.activeShop || this.state.activeShop.runId !== runId) {
      throw new Error("Shop not found for this run.");
    }

    return clone(this.state.activeShop);
  }

  async buyCard(input: BuyCardInput): Promise<BuyCardResult> {
    const run = this.assertActiveRun(input.runId);
    const shop = this.assertActiveShop(input.runId);

    if (!shop.availableTabs.includes(input.tab)) {
      throw new Error("Tab is not available in this run.");
    }

    const offers = shop.offersByTab[input.tab];
    if (!offers || offers.length === 0) {
      throw new Error("No offers available in this tab.");
    }

    const offer = offers.find((entry) => entry.id === input.offerId);
    if (!offer) {
      throw new Error("Offer not found.");
    }

    if (offer.purchased) {
      return {
        run: clone(run),
        shop: clone(shop),
      };
    }

    if (run.gold < offer.price) {
      throw new Error("Not enough gold.");
    }

    offer.purchased = true;
    run.gold -= offer.price;

    this.state.activeRun = run;
    this.state.activeShop = shop;
    this.persist();

    return {
      run: clone(run),
      shop: clone(shop),
    };
  }

  async endRun(runId: string, input: EndRunInput): Promise<EndRunResult> {
    const run = this.assertActiveRun(runId);

    const finalRound = Math.max(input.highestRoundReached, run.highestRoundReached);

    const profile = normalizeProfile({
      ...this.state.profile,
      totalRuns: this.state.profile.totalRuns + 1,
      highestRoundEver: Math.max(this.state.profile.highestRoundEver, finalRound),
      pendingUnlocks: [...this.state.profile.pendingUnlocks],
      unlockedSystems: [...this.state.profile.unlockedSystems],
    });

    const nextUnlockRule = getNextUnlockRule(profile.unlockedSystems);
    let awardedUnlock: QueuedUnlock | null = null;

    if (
      nextUnlockRule &&
      profile.totalRuns >= nextUnlockRule.condition.minRun &&
      finalRound >= nextUnlockRule.condition.minRound
    ) {
      profile.unlockedSystems.push(nextUnlockRule.system);
      awardedUnlock = {
        system: nextUnlockRule.system,
        title: nextUnlockRule.title,
        description: nextUnlockRule.description,
        unlockedAtRun: profile.totalRuns,
        unlockedAtRound: finalRound,
      };
      profile.pendingUnlocks.push(awardedUnlock);
    }

    const normalizedProfile = normalizeProfile(profile);

    this.state.profile = normalizedProfile;
    this.state.activeRun = null;
    this.state.activeShop = null;
    this.persist();

    return {
      progress: clone(normalizedProfile),
      awardedUnlock,
    };
  }

  async peekNextUnlock(): Promise<QueuedUnlock | null> {
    return clone(this.state.profile.pendingUnlocks[0] ?? null);
  }

  async consumeNextUnlock(): Promise<QueuedUnlock | null> {
    const [nextUnlock] = this.state.profile.pendingUnlocks;
    if (!nextUnlock) {
      return null;
    }

    this.state.profile.pendingUnlocks = this.state.profile.pendingUnlocks.slice(1);
    this.persist();

    return clone(nextUnlock);
  }

  private assertActiveRun(runId: string): ActiveRun {
    if (!this.state.activeRun || this.state.activeRun.runId !== runId) {
      throw new Error("Run not found.");
    }

    return clone(this.state.activeRun);
  }

  private assertActiveShop(runId: string): ShopState {
    if (!this.state.activeShop || this.state.activeShop.runId !== runId) {
      throw new Error("Shop not found.");
    }

    return clone(this.state.activeShop);
  }

  private buildShop(
    runId: string,
    runNumber: number,
    unlockedSystems: ProfileProgress["unlockedSystems"]
  ): ShopState {
    return {
      runId,
      availableTabs: getAvailableShopTabs(unlockedSystems),
      offersByTab: {
        DECK: getDeckOffersForRun(runNumber),
      },
    };
  }

  private persist(): void {
    safeWriteLocalStorage(JSON.stringify(this.state));
  }
}

export const createMockGameApi = (): GameApi => {
  return new MockGameApi();
};
