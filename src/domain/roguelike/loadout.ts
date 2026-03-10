import {
  LoadoutSelection,
  PactDefinition,
  UpgradeDefinition,
} from "./types";

const byId = <T extends { id: string }>(items: T[]): Map<string, T> =>
  new Map(items.map((item) => [item.id, item]));

export const selectUpgrades = (
  selectedIds: string[],
  allUpgrades: UpgradeDefinition[]
): UpgradeDefinition[] => {
  const map = byId(allUpgrades);
  return selectedIds
    .map((id) => map.get(id))
    .filter((item): item is UpgradeDefinition => item !== undefined);
};

export const selectPacts = (
  selectedIds: string[],
  allPacts: PactDefinition[]
): PactDefinition[] => {
  const map = byId(allPacts);
  return selectedIds
    .map((id) => map.get(id))
    .filter((item): item is PactDefinition => item !== undefined);
};

export const calculateLoadoutCost = (
  loadout: LoadoutSelection,
  upgrades: UpgradeDefinition[],
  pacts: PactDefinition[]
): number => {
  const selectedUpgrades = selectUpgrades(loadout.selectedUpgradeIds, upgrades);
  const selectedPacts = selectPacts(loadout.selectedPactIds, pacts);

  const upgradesCost = selectedUpgrades.reduce(
    (accumulator, upgrade) => accumulator + upgrade.cost,
    0
  );
  const pactsCost = selectedPacts.reduce(
    (accumulator, pact) => accumulator + pact.cost,
    0
  );

  return upgradesCost + pactsCost;
};

export const sumUpgradeEffect = (
  upgrades: UpgradeDefinition[],
  kind: "PLAYS" | "DISCARDS" | "START_GOLD" | "BOSS_TEMP_POINTS"
): number => {
  return upgrades.reduce((accumulator, upgrade) => {
    if (!upgrade.effect || upgrade.effect.kind !== kind) {
      return accumulator;
    }

    return accumulator + upgrade.effect.value;
  }, 0);
};

export const sumPactEffect = (
  pacts: PactDefinition[],
  kind: "PLAYS" | "DISCARDS" | "START_GOLD"
): number => {
  return pacts.reduce((accumulator, pact) => {
    if (!pact.effect || pact.effect.kind !== kind) {
      return accumulator;
    }

    return accumulator + pact.effect.value;
  }, 0);
};
