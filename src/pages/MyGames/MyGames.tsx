import { Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DailyGames } from "../../components/DailyGames/DailyGames.tsx";
import { DelayedLoading } from "../../components/DelayedLoading.tsx";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { logEvent } from "../../utils/analytics.ts";
import { GamesListBox } from "./GamesListBox.tsx";
import { getGameLoopBlockchain } from "../../utils/gameLoopBurner.ts";

export interface GameSummary {
  id: number;
  level?: number;
  status: string;
  points?: number;
  currentNodeId?: number;
  round?: number;
  isTournament?: boolean;
}

const BLOCKCHAIN = getGameLoopBlockchain();
const IS_CELO = BLOCKCHAIN === "celo";

export const MyGames = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });
  const navigate = useNavigate();
  const { prepareNewGame, executeCreateGame } = useGameContext();

  useEffect(() => {
    logEvent("open_my_games_page");
  }, []);

  const { isSmallScreen } = useResponsiveValues();

  const handleCreateGame = () => {
    prepareNewGame();
    executeCreateGame();
    navigate("/entering-tournament");
  };

  return (
    <DelayedLoading ms={100}>
      <MobileDecoration />
      <Flex
        direction="column"
        justifyContent={isSmallScreen ? "space-between" : "center"}
        alignItems="center"
        height="100%"
        width="100%"
        pt={[8, 16]}
        pb={[0, 4]}
      >
        <Flex
          flexDirection={"column"}
          height={isSmallScreen ? "75%" : "70%"}
          // bgColor="red"
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Heading
            mb={8}
            zIndex={2}
            variant="italic"
            size={isSmallScreen ? "sm" : "md"}
          >
            {t("title")}
          </Heading>
          <GamesListBox isTournament={false} />
        </Flex>
        <Flex
          w="100%"
          // bgColor="blue"
          h={isSmallScreen ? "25%" : "30%"}
          justifyContent={"center"}
          alignItems={"center"}
          pb={4}
        >
          {IS_CELO ? (
            <MobileBottomBar
              firstButton={{
                label: t("back-to-home"),
                onClick: () => navigate("/"),
              }}
              secondButton={{
                label: t("start-game"),
                onClick: handleCreateGame,
              }}
            />
          ) : (
            <Flex
              w="100%"
              flexDirection="column"
              alignItems="center"
              gap={isSmallScreen ? 4 : 6}
            >
              <DailyGames />
            </Flex>
          )}
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
