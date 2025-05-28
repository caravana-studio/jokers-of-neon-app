import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { GameSummary } from "./MyGames.tsx";

export const GameBox = ({ game }: { game: GameSummary }) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  const { syncCall } = useDojo();
  const { executeCreateGame, setGameId, prepareNewGame, surrenderGame } =
    useGameContext();
  const { isSmallScreen } = useResponsiveValues();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinueButtonClick = async () => {
    setIsLoading(true);
    prepareNewGame();
    if (game.status === GameStateEnum.NotStarted) {
      executeCreateGame(game.id);
    } else {
      setGameId(game.id);
      await syncCall();
      navigate(`/redirect/state`);
    }
  };

  const handleSurrenderButtonClick = async () => {
    setIsLoading(true);
    try {
      surrenderGame;
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      alignItems="center"
      border="1px solid white"
      borderRadius="15px"
      color="white"
      p={2}
      width="100%"
      height={isSmallScreen ? "60px" : "70px"}
      opacity={game.status === GameStateEnum.GameOver ? 0.6 : 1}
    >
      <Flex
        fontWeight="bold"
        flexDirection="row"
        flex={1}
        justifyContent="space-between"
        alignItems="center"
        px={isSmallScreen ? 1 : 3}
      >
        {/* Game ID Section */}
        <Flex alignItems="center" gap={1.5}>
          <CachedImage
            src="/logos/jn.png"
            height={isSmallScreen ? "15px" : "25px"}
          />
          <Text
            fontFamily="Orbitron"
            fontSize={isSmallScreen ? "13px" : "23px"}
            fontWeight="bold"
          >
            {" "}
            · {game.id}
          </Text>
        </Flex>

        {/* Game Info Section */}
        <Flex flexDirection="column" mt={1}>
          {game.level && (
            <Flex gap={1}>
              <Text>{t("level-lbl")}:</Text>
              <Text color="lightViolet">{game.level}</Text>
            </Flex>
          )}
          <Flex gap={1}>
            {!isSmallScreen && <Text>{t("status-lbl")}:</Text>}
            <Text color="lightViolet">{game.status}</Text>
          </Flex>
          {isSmallScreen && game.points !== undefined && (
            <Flex gap={1}>
              <Text color="lightViolet">{game.points?.toLocaleString()}</Text>
              <Text>points</Text>
            </Flex>
          )}
        </Flex>

        {/* Points Section - Desktop Only */}
        {!isSmallScreen && (
          <Flex>
            {game.points !== undefined && (
              <Flex gap={1}>
                <Text fontSize="lg" color="lightViolet">
                  {game.points?.toLocaleString()}
                </Text>
                <Text fontSize="lg">points</Text>
              </Flex>
            )}
          </Flex>
        )}

        {/* Action Button Section */}
        <Flex w={isSmallScreen ? "35%" : "25%"} justifyContent="flex-end">
          {game.status !== GameStateEnum.GameOver && (
            <Flex gap={4} alignItems={"center"}>
              <Spinner
                size={{ base: "xs", sm: "sm" }}
                visibility={isLoading ? "visible" : "hidden"}
                px={2}
              />
              <Button
                size="sm"
                width={isSmallScreen ? "60px" : "110px"}
                h={isSmallScreen ? "25px" : undefined}
                variant="secondarySolid"
                onClick={handleContinueButtonClick}
                disabled={isLoading}
              >
                {t(
                  game.status === GameStateEnum.NotStarted
                    ? "start-btn"
                    : "continue-btn"
                ).toUpperCase()}
              </Button>
              <Button
                size="sm"
                width={isSmallScreen ? "60px" : "110px"}
                h={isSmallScreen ? "25px" : undefined}
                variant="solid"
                onClick={handleSurrenderButtonClick}
                disabled={isLoading}
              >
                {t("surrender-btn").toUpperCase()}
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
