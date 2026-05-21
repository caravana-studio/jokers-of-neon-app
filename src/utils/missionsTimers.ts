import { getCurrentGameLeaderboardPeriods } from "./leaderboardPeriods";

const RESET_TIME = import.meta.env.VITE_RESET_TIME_UTC || "6";

export const getNextDailyMissionResetDate = (now = new Date()) => {
  const reset = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      Number(RESET_TIME),
      0,
      0,
      0
    )
  );

  if (now >= reset) {
    reset.setUTCDate(reset.getUTCDate() + 1);
  }

  return reset;
};

export const getNextWeeklyMissionResetDate = (now = new Date()) =>
  getCurrentGameLeaderboardPeriods(now).weekly.resetAt;
