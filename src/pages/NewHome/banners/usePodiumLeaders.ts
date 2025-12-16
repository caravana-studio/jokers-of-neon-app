import { useMemo } from "react";
import { useGetLeaderboard } from "../../../queries/useGetLeaderboard";
import { useTournamentSettings } from "../../../queries/useTournamentSettings";
import { useGameStore } from "../../../state/useGameStore";

export const usePodiumLeaders = () => {
  const { id: gameId } = useGameStore();
  const { tournament } = useTournamentSettings();
  const isTournament = Boolean(tournament?.isActive);

  const { data: fullLeaderboard } = useGetLeaderboard(
    gameId,
    true,
    isTournament
  );

  const leaders = useMemo(() => {
    const topPlayers =
      fullLeaderboard?.slice(0, 3).map((player) => player.player_name) ?? [];
    return topPlayers.filter(
      (playerName): playerName is string => Boolean(playerName)
    );
  }, [fullLeaderboard]);

  return { leaders, tournament };
};
