import { useEffect, useMemo, useState } from "react";
import { AppType, useAppContext } from "../../../providers/AppContextProvider";
import { useGetApiLeaderboard } from "../../../queries/useGetApiLeaderboard";
import { useGetLeaderboard } from "../../../queries/useGetLeaderboard";
import { useTournamentSettings } from "../../../queries/useTournamentSettings";
import { useGameStore } from "../../../state/useGameStore";
import { getCurrentGameLeaderboardPeriods } from "../../../utils/leaderboardPeriods";
import { getGameLoopBlockchain } from "../../../utils/gameLoopBurner";

export const usePodiumLeaders = () => {
  const appType = useAppContext();
  const { id: gameId } = useGameStore();
  const { tournament } = useTournamentSettings();
  const isTournament = Boolean(tournament?.isActive);
  const [now, setNow] = useState(() => new Date());
  const periods = useMemo(() => getCurrentGameLeaderboardPeriods(now), [now]);
  const isMiniApp = appType === AppType.MINIAPP;

  const { data: fullLeaderboard } = useGetLeaderboard(
    gameId,
    true,
    isTournament
  );
  const { data: apiLeaderboard } = useGetApiLeaderboard({
    blockchain: getGameLoopBlockchain(),
    startDate: periods.weekly.startDate,
    endDate: periods.weekly.endDate,
    isTournament: false,
    limit: 3,
    enabled: isMiniApp,
  });

  useEffect(() => {
    if (!isMiniApp) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [isMiniApp]);

  const leaders = useMemo(() => {
    if (isMiniApp) {
      const apiLeaders =
        apiLeaderboard?.entries.slice(0, 3).map((player) => player.displayName) ??
        [];

      return apiLeaders.filter(
        (playerName): playerName is string => Boolean(playerName)
      );
    }

    const topPlayers =
      fullLeaderboard?.slice(0, 3).map((player) => player.player_name) ?? [];
    return topPlayers.filter(
      (playerName): playerName is string => Boolean(playerName)
    );
  }, [apiLeaderboard?.entries, fullLeaderboard, isMiniApp]);

  return { leaders, tournament };
};
