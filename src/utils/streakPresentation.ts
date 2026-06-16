import type { NavigateFunction } from "react-router-dom";
import { HIDE_STREAK } from "../config/featureFlags";

export const SKIP_STREAK_PRESENTATION_CHECK = "skipStreakPresentationCheck";
export const isStreakHidden = HIDE_STREAK;

export type StreakPresentationContinuation =
  | {
      type: "route";
      to: string;
      replace?: boolean;
      state?: Record<string, unknown> | null;
    }
  | {
      type: "map-after-rewards";
    }
  | {
      type: "map";
    };

export type StreakIncreasedLocationState = {
  streak?: number;
  from?: string;
  fromState?: Record<string, unknown> | null;
  replaceOnClose?: boolean;
  continuation?: StreakPresentationContinuation;
};

export function navigateToStreakIncreased(
  navigate: NavigateFunction,
  options: {
    streak: number;
    continuation?: StreakPresentationContinuation;
    from?: string;
    fromState?: Record<string, unknown> | null;
    replace?: boolean;
    replaceOnClose?: boolean;
  }
): boolean {
  if (isStreakHidden) {
    return false;
  }

  const {
    streak,
    continuation,
    from,
    fromState,
    replace = false,
    replaceOnClose = false,
  } = options;

  navigate("/streak-increased", {
    replace,
    state: {
      streak,
      continuation,
      from,
      fromState,
      replaceOnClose,
    } satisfies StreakIncreasedLocationState,
  });

  return true;
}
