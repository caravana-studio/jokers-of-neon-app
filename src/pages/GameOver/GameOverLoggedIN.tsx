import { Flex } from "@chakra-ui/react";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GameOverContent } from "./GameOverContent";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { useGameOver } from "../../hooks/useGameOver";
import { useResponsiveValues } from "../../theme/responsiveSettings";

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
  const { isSmallScreen } = useResponsiveValues();

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
      bottomContent={
        isSmallScreen && (
          <Flex position="absolute" bottom={0} w="100%" zIndex={1000}>
            <MobileBottomBar
              firstButton={{
                onClick: onShareClick,
                label: t("game-over.btn.gameOver-share-btn"),
                icon: <FontAwesomeIcon fontSize={10} icon={faXTwitter} />,
              }}
              secondButton={{
                onClick: onStartGameClick,
                label: t("game-over.btn.gameOver-newGame-btn"),
                disabled: isLoading,
              }}
              hideDeckButton
            />
          </Flex>
        )
      }
    />
  );
};
