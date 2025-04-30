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
  const { executeCreateGame, setGameId } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    setIsLoading(true);
    if (game.status === "NOT STARTED") {
      executeCreateGame(game.id);
    } else {
      setGameId(game.id);
      await syncCall();
      navigate(`/redirect/state`);
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
        <Flex 
          w={isSmallScreen ? "35%" : "30%"} 
          alignItems="center" 
          gap={1.5}
        >
          <CachedImage 
            src="/logos/jn.png" 
            height={isSmallScreen ? "15px" : "25px"} 
          />
          <Text 
            fontFamily="Orbitron" 
            fontSize={isSmallScreen ? "13px" : "23px"} 
            fontWeight="bold"
          >
            {" "}· {game.id}
          </Text>
        </Flex>

        {/* Game Info Section */}
        <Flex 
          w={isSmallScreen ? "35%" : "30%"} 
          flexDirection="column" 
          mt={1}
        >
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
          <Flex w="20%">
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
        <Flex 
          w={isSmallScreen ? "30%" : "20%"} 
          justifyContent="flex-end"
        >
          {game.status !== GameStateEnum.GameOver && (
            <Button
              size="sm"
              width={isSmallScreen ? "80px" : "110px"}
              h={isSmallScreen ? "25px" : undefined}
              variant="secondarySolid"
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {t(
                game.status === "NOT STARTED" ? "start-btn" : "continue-btn"
              ).toUpperCase()}
              {isLoading && <Spinner ml={3} size="sm" />}
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};