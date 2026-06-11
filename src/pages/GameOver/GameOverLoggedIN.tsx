import { GameOverContent } from "./GameOverContent";
import { useGameOver } from "../../hooks/useGameOver";

export const GameOverLoggedIn = () => {
  const {
    gameId,
    congratulationsMsj,
    actualPlayer,
    t,
    onSecondButtonClick,
  } = useGameOver();

  return (
    <GameOverContent
      gameId={gameId}
      congratulationsMsj={congratulationsMsj}
      actualPlayerPosition={actualPlayer?.position}
      t={t}
      leaderboardFilterLoggedInPlayers={true}
      loggedIn
      secondButton={{
        onClick: () => {
          onSecondButtonClick();
        },
        label: t("game-over.btn.gameOver-mygames-btn").toUpperCase(),
      }}
    />
  );
};
