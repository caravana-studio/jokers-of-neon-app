import { PROGRESSIVE_TUTORIAL_STATE } from "../constants/localStorage";

export const PROGRESSIVE_TUTORIAL_IDS = {
  GAME_FIRST_ENTRY: "game_first_entry",
  GAME_FIRST_MODIFIER: "game_first_modifier",
  GAME_FIRST_SPECIAL_CARD: "game_first_special_card",
  GAME_FIRST_POWER_UP: "game_first_power_up",
  GAME_FIRST_TWO_SELECTED: "game_first_two_selected",
  GAME_FIRST_SCORE: "game_first_score",
  REWARDS_FIRST_ENTRY: "rewards_first_entry",
  MAP_FIRST_ENTRY: "map_first_entry",
  SHOP_FIRST_ENTRY: "shop_first_entry",
} as const;

export type ProgressiveTutorialId =
  (typeof PROGRESSIVE_TUTORIAL_IDS)[keyof typeof PROGRESSIVE_TUTORIAL_IDS];

export type ProgressiveTutorialState = Partial<
  Record<ProgressiveTutorialId, boolean>
>;

const readProgressiveTutorialState = (): ProgressiveTutorialState => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(PROGRESSIVE_TUTORIAL_STATE);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as ProgressiveTutorialState;
    }
    return {};
  } catch {
    return {};
  }
};

const writeProgressiveTutorialState = (state: ProgressiveTutorialState) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PROGRESSIVE_TUTORIAL_STATE, JSON.stringify(state));
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
