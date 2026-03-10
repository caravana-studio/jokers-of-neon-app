import { UnlockRule, UnlockableSystem } from "./types";

export const BASE_TOTAL_PLAYS = 3;
export const BASE_TOTAL_DISCARDS = 3;
export const BASE_START_GOLD = 10;

export const PREPARE_RUN_BASE_POINTS = 2;
export const PREPARE_RUN_POINT_CAP_MAX = 6;
export const PREPARE_RUN_POINT_CAP_STEP_RUNS = 5;
export const PREPARE_RUN_UNLOCK_RUN_TARGET = 20;

export const UNLOCK_PROGRESS_PATH: UnlockRule[] = [
  {
    system: "TRADITIONAL_CARDS",
    title: "Cartas Tradicionales",
    description: "Se habilitan cartas tradicionales en la tienda Deck.",
    condition: { minRun: 3, minRound: 2 },
  },
  {
    system: "MODIFIERS_C",
    title: "Modificadoras C",
    description: "Se habilita la primera capa de cartas modificadoras.",
    condition: { minRun: 1, minRound: 2 },
  },
  {
    system: "SPECIALS_C",
    title: "Especiales C",
    description: "Empiezan a aparecer especiales de rareza C.",
    condition: { minRun: 2, minRound: 2 },
  },
  {
    system: "MODIFIERS_BA",
    title: "Modificadoras B/A",
    description: "Se desbloquean modificadoras de tiers superiores.",
    condition: { minRun: 4, minRound: 3 },
  },
  {
    system: "POWER_UPS_CB",
    title: "Power Ups C/B",
    description: "Se habilita la primera generación de power ups.",
    condition: { minRun: 6, minRound: 3 },
  },
  {
    system: "LEVEL_UPS",
    title: "Level Ups",
    description: "La tienda habilita mejoras de manos por nivel.",
    condition: { minRun: 8, minRound: 4 },
  },
  {
    system: "SPECIALS_B",
    title: "Especiales B",
    description: "Se agrega la segunda capa de especiales.",
    condition: { minRun: 10, minRound: 4 },
  },
  {
    system: "LOOT_BOXES",
    title: "Loot Boxes",
    description: "Ahora la tienda puede ofrecer loot boxes.",
    condition: { minRun: 12, minRound: 4 },
  },
  {
    system: "NEON_CARDS",
    title: "Neon Cards",
    description: "Se habilitan cartas neon en el loop.",
    condition: { minRun: 14, minRound: 5 },
  },
  {
    system: "SPECIALS_A",
    title: "Especiales A",
    description: "Se habilitan especiales de rareza A.",
    condition: { minRun: 16, minRound: 5 },
  },
  {
    system: "POWER_UPS_AS",
    title: "Power Ups A/S",
    description: "Se desbloquean power ups de alta rareza.",
    condition: { minRun: 18, minRound: 5 },
  },
  {
    system: "SPECIALS_S",
    title: "Especiales S",
    description: "Se abre la capa final de especiales.",
    condition: { minRun: 19, minRound: 6 },
  },
  {
    system: "PREPARE_RUN",
    title: "Prepare Run",
    description: "Se desbloquea Loadout antes de iniciar cada run.",
    condition: { minRun: PREPARE_RUN_UNLOCK_RUN_TARGET, minRound: 6 },
  },
];

export const INITIAL_TREE_SYSTEMS = UNLOCK_PROGRESS_PATH.map(
  (rule) => rule.system
);

export const getNextUnlockRule = (
  unlockedSystems: UnlockableSystem[]
): UnlockRule | null => {
  const unlockedSet = new Set(unlockedSystems);
  return (
    UNLOCK_PROGRESS_PATH.find((rule) => !unlockedSet.has(rule.system)) ?? null
  );
};

export const isInitialTreeCompleted = (
  unlockedSystems: UnlockableSystem[]
): boolean => {
  const unlockedSet = new Set(unlockedSystems);
  return INITIAL_TREE_SYSTEMS.every((system) => unlockedSet.has(system));
};

export const computePointCap = (
  totalRuns: number,
  unlockedSystems: UnlockableSystem[]
): number => {
  if (!unlockedSystems.includes("PREPARE_RUN")) {
    return 0;
  }

  const extraSteps = Math.max(
    0,
    Math.floor((totalRuns - PREPARE_RUN_UNLOCK_RUN_TARGET) / PREPARE_RUN_POINT_CAP_STEP_RUNS)
  );

  return Math.min(
    PREPARE_RUN_BASE_POINTS + extraSteps,
    PREPARE_RUN_POINT_CAP_MAX
  );
};
