import { GameOverContent } from "./GameOverContent";
import { useGameOver } from "../../hooks/useGameOver";

export const GameOverLoggedIn = () => {
  const {
    gameId,
    congratulationsMsj,
    actualPlayer,
    t,
    onShareClick,
    onStartGameClick,
    isLoading,
  } = useGameOver();

  return (
    <GameOverContent
      gameId={gameId}
      congratulationsMsj={congratulationsMsj}
      actualPlayerPosition={actualPlayer?.position}
      t={t}
      onShareClick={onShareClick}
      onStartGameClick={onStartGameClick}
      isLoading={isLoading}
      leaderboardFilterLoggedInPlayers={true}
      loggedIn
    />
  );
};
