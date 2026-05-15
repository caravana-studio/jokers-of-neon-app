import { Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import { logEvent } from "../utils/analytics";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { GamesListBox } from "../pages/MyGames/GamesListBox";

export const MiniAppMyGamesPage = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });
  const navigate = useNavigate();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();

  useEffect(() => {
    logEvent("open_my_games_page");
  }, []);

  const handleCreateGame = () => {
    prepareNewGame();
    const createGamePromise = executeCreateGame();
    navigate("/entering-tournament");

    void createGamePromise.then((started) => {
      if (started) {
        return;
      }

      navigate("/my-games", { replace: true });
    });
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
          h={isSmallScreen ? "25%" : "30%"}
          justifyContent={"center"}
          alignItems={"center"}
          pb={4}
        >
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
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
