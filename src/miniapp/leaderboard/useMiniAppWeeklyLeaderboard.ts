import { useMemo } from "react";
import { useGetApiLeaderboard } from "../../queries/useGetApiLeaderboard";
import { getCurrentGameLeaderboardPeriods } from "../../utils/leaderboardPeriods";
import { addressKey } from "../../utils/starknetAddress";
import {
  getMiniAppBlockchain,
  useMiniAppIdentity,
} from "../session/useMiniAppSession";

export const useMiniAppWeeklyLeaderboard = (now: Date, limit = 50) => {
  const { userAddress } = useMiniAppIdentity();
  const periods = useMemo(() => getCurrentGameLeaderboardPeriods(now), [now]);
  const currentUserAddress = addressKey(userAddress);

  const query = useGetApiLeaderboard({
    blockchain: getMiniAppBlockchain(),
    startDate: periods.weekly.startDate,
    endDate: periods.weekly.endDate,
    isTournament: false,
    limit,
  });

  return {
    ...query,
    periods,
    currentUserAddress,
    entries: query.data?.entries ?? [],
  };
};
