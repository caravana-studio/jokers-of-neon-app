import { Button, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { RemoveScroll } from "react-remove-scroll";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import SpineAnimation from "../components/SpineAnimation";
import { useGameContext } from "../providers/GameProvider";
import { useGetMyGames } from "../queries/useGetMyGames";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { logEvent } from "../utils/analytics";

export const Home = () => {
  const { t } = useTranslation(["home"]);
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const { data: games } = useGetMyGames();

  const [isTutorialModalOpen, setTutorialModalOpen] = useState(false);

  const handleCreateGame = async () => {
    prepareNewGame();
    executeCreateGame();
    navigate("/entering-tournament");
  };

  const handlePlayClick = () => {
    if (games && games.length > 0) {
      navigate("/my-games");
    } else {
      setTutorialModalOpen(true);
    }
  };

  const handleConfirmTutorial = () => {
    navigate("/tutorial");
    setTutorialModalOpen(false);
  };

  const handleDeclineTutorial = () => {
    handleCreateGame();
    setTutorialModalOpen(false);

    logEvent("tutorial_skipped");
    logEvent("tutorial_done");
  };

  return (
    <DelayedLoading ms={100}>
      <MobileDecoration />
      <RemoveScroll>
        <></>
      </RemoveScroll>
      <Flex
        height="100%"
        width={"100%"}
        justifyContent="space-between"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Flex h="90px" />
        <Flex
          flexDirection="column"
          alignItems="center"
          gap={{ base: 6, sm: 8, md: 6 }}
          w={"100%"}
          zIndex={1}
        >
          <Heading
            size="xl"
            color="white"
            fontSize={{ base: 10, sm: 20, md: 25, lg: 30 }}
          >
            {t("home.slogan")}
          </Heading>

          <Flex
            w={"100%"}
            h={"100%"}
            justifyContent="center"
            minH={isSmallScreen ? "unset" : "40vh"}
            flexGrow={1}
            maxWidth={isSmallScreen ? "70%" : "50%"}
          >
            <Flex h={"100%"} w="100%" justifyContent={"center"} pl={2}>
              <SpineAnimation
                jsonUrl={`/spine-animations/logo/JokerLogo.json`}
                atlasUrl={`/spine-animations/logo/JokerLogo.atlas`}
                initialAnimation={"animation"}
                loopAnimation={"animation"}
                scale={2.4}
                yOffset={-800}
              />
            </Flex>
          </Flex>
          {!isSmallScreen && (
            <Flex gap={8}>
              <Button onClick={() => navigate("/leaderboard")} w="300px">
                {t("home.btn.leaderboard-btn")}
              </Button>
              <Button
                onClick={handlePlayClick}
                w="300px"
                variant="secondarySolid"
              >
                {games && games.length > 0 ? t("my-games") : t("play")}
              </Button>
            </Flex>
          )}
        </Flex>
        {isSmallScreen ? (
          <MobileBottomBar
            firstButton={{
              label: t("leaderboard.title"),
              onClick: () => navigate("/leaderboard"),
            }}
            secondButton={{
              label: games && games.length > 0 ? t("my-games") : t("play"),
              onClick: handlePlayClick,
            }}
          />
        ) : (
          <Flex h="50px" />
        )}
      </Flex>

      {isTutorialModalOpen && (
        <ConfirmationModal
          close={handleDeclineTutorial}
          title={t("tutorialModal.title")}
          description={t("tutorialModal.description")}
          confirmText={t("tutorialModal.confirm-text")}
          cancelText={t("tutorialModal.cancel-text")}
          onConfirm={handleConfirmTutorial}
        />
      )}
    </DelayedLoading>
  );
};
