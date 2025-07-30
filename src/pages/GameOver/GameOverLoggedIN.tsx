import { GameOverContent } from "./GameOverContent";
import { useGameOver } from "../../hooks/useGameOver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

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
      firstButton={{
        onClick: () => {
          onShareClick();
        },
        label: t("game-over.btn.gameOver-share-btn").toUpperCase(),
        icon: <FontAwesomeIcon fontSize={12} icon={faXTwitter} />,
      }}
      secondButton={{
        onClick: () => {
          onStartGameClick();
        },
        label: t("game-over.btn.gameOver-newGame-btn").toUpperCase(),
      }}
    />
  );
};
