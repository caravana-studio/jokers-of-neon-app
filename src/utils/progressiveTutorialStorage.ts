import { PROGRESSIVE_TUTORIAL_STATE as PROGRESSIVE_TUTORIAL_STATE_KEY } from "../constants/localStorage";

export const PROGRESSIVE_TUTORIAL_IDS = {
  GAME_FIRST_ENTRY: "game_first_entry",
  GAME_FIRST_MODIFIER: "game_first_modifier",
  GAME_FIRST_SPECIAL_CARD: "game_first_special_card",
  GAME_FIRST_POWER_UP: "game_first_power_up",
  GAME_FIRST_NEON_CARD: "game_first_neon_card",
  GAME_FIRST_TWO_SELECTED: "game_first_two_selected",
  GAME_FIRST_SCORE: "game_first_score",
  REWARDS_FIRST_ENTRY: "rewards_first_entry",
  MAP_FIRST_ENTRY: "map_first_entry",
  SHOP_FIRST_ENTRY: "shop_first_entry",
} as const;

export const PROGRESSIVE_TUTORIAL_STATE = PROGRESSIVE_TUTORIAL_STATE_KEY;

export type ProgressiveTutorialId =
  (typeof PROGRESSIVE_TUTORIAL_IDS)[keyof typeof PROGRESSIVE_TUTORIAL_IDS];

export type ProgressiveTutorialState = Partial<
  Record<ProgressiveTutorialId, boolean>
>;

const KNOWN_TUTORIAL_IDS = new Set<string>(
  Object.values(PROGRESSIVE_TUTORIAL_IDS)
);

const readProgressiveTutorialState = (
  storageKey: string = PROGRESSIVE_TUTORIAL_STATE
): ProgressiveTutorialState => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }

    return Object.entries(parsed).reduce<ProgressiveTutorialState>(
      (acc, [id, completed]) => {
        if (KNOWN_TUTORIAL_IDS.has(id) && completed === true) {
          acc[id as ProgressiveTutorialId] = true;
        }
        return acc;
      },
      {}
    );
  } catch {
    return {};
  }
};

const writeProgressiveTutorialState = (
  state: ProgressiveTutorialState,
  storageKey: string = PROGRESSIVE_TUTORIAL_STATE
) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

export const getProgressiveTutorialState = (): ProgressiveTutorialState =>
  readProgressiveTutorialState();

export const setProgressiveTutorialCompleted = (
  id: ProgressiveTutorialId,
  completed = true
) => {
  const current = readProgressiveTutorialState();
  writeProgressiveTutorialState({
    ...current,
    [id]: completed,
  });
};
