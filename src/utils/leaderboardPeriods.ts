const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DEFAULT_RESET_HOUR_UTC = 6;

const getResetHourUtc = () => {
  const resetHour = Number(import.meta.env.VITE_RESET_TIME_UTC);

  if (!Number.isFinite(resetHour)) {
    return DEFAULT_RESET_HOUR_UTC;
  }

  return Math.max(0, Math.min(23, Math.floor(resetHour)));
};

const formatUtcDate = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const addDaysToUtcDateString = (dateString: string, days: number) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  date.setUTCDate(date.getUTCDate() + days);

  return formatUtcDate(date);
};

const getCurrentGameDayWindow = (now: Date) => {
  const resetHourUtc = getResetHourUtc();

  const todayReset = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      resetHourUtc,
      0,
      0,
      0
    )
  );

  const start = now >= todayReset
    ? todayReset
    : new Date(todayReset.getTime() - DAY_IN_MS);

  const end = new Date(start.getTime() + DAY_IN_MS);

  return { start, end };
};

export const getCurrentGameLeaderboardPeriods = (now = new Date()) => {
  const { start: currentGameDayStart, end: nextDailyReset } =
    getCurrentGameDayWindow(now);

  const currentWeekDay = currentGameDayStart.getUTCDay();
  const daysSinceMonday = (currentWeekDay + 6) % 7;
  const currentWeekStart = new Date(currentGameDayStart);
  currentWeekStart.setUTCDate(currentWeekStart.getUTCDate() - daysSinceMonday);

  const nextWeeklyReset = new Date(currentWeekStart.getTime() + 7 * DAY_IN_MS);

  return {
    daily: {
      date: formatUtcDate(currentGameDayStart),
      resetAt: nextDailyReset,
    },
    weekly: {
      startDate: formatUtcDate(currentWeekStart),
      currentDate: formatUtcDate(currentGameDayStart),
      resetAt: nextWeeklyReset,
    },
  };
};
