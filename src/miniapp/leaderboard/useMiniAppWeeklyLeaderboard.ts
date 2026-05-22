import { useMemo } from "react";
import { useGetApiLeaderboard } from "../../queries/useGetApiLeaderboard";
import { getCurrentGameLeaderboardPeriods } from "../../utils/leaderboardPeriods";
import { addressKey } from "../../utils/starknetAddress";
import { getMiniAppWeeklyLeaderboardPeriod } from "./getMiniAppWeeklyLeaderboardPeriod";
import { useMiniAppTournamentSettings } from "./useMiniAppTournamentSettings";
import {
  getMiniAppBlockchain,
  useMiniAppIdentity,
} from "../session/useMiniAppSession";

export const useMiniAppWeeklyLeaderboard = (now: Date, limit = 50) => {
  const { userAddress } = useMiniAppIdentity();
  const { tournament } = useMiniAppTournamentSettings();
  const periods = useMemo(() => getCurrentGameLeaderboardPeriods(now), [now]);
  const weeklyPeriod = useMemo(
    () => getMiniAppWeeklyLeaderboardPeriod(periods.weekly, tournament),
    [periods.weekly, tournament]
  );
  const currentUserAddress = addressKey(userAddress);

  const query = useGetApiLeaderboard({
    blockchain: getMiniAppBlockchain(),
    startDate: weeklyPeriod.startDate,
    endDate: weeklyPeriod.endDate,
    isTournament: false,
    limit,
  });

  return {
    ...query,
    periods,
    tournament,
    weeklyPeriod,
    currentUserAddress,
    entries: query.data?.entries ?? [],
  };
};
