type WeeklyLeaderboardPeriod = {
  startDate: string;
  endDate: string;
  currentDate: string;
  resetAt: Date;
};

type MiniAppTournamentDateOverrides = {
  isActive: boolean;
  startDate: Date | null;
  finishDate: Date | null;
};

const formatUtcDate = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getMiniAppWeeklyLeaderboardPeriod = (
  defaultPeriod: WeeklyLeaderboardPeriod,
  tournament: MiniAppTournamentDateOverrides
): WeeklyLeaderboardPeriod => {
  if (!tournament.isActive) {
    return defaultPeriod;
  }

  return {
    ...defaultPeriod,
    startDate: tournament.startDate
      ? formatUtcDate(tournament.startDate)
      : defaultPeriod.startDate,
    endDate: tournament.finishDate
      ? formatUtcDate(tournament.finishDate)
      : defaultPeriod.endDate,
    resetAt: tournament.finishDate ?? defaultPeriod.resetAt,
  };
};
