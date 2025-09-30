import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { RemoveScroll } from "react-remove-scroll";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { ProfileTile } from "../../components/ProfileTile";
import SpineAnimation from "../../components/SpineAnimation";
import { useGameContext } from "../../providers/GameProvider";
import { useGetMyGames } from "../../queries/useGetMyGames";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { ComingSeasonBanner } from "./banners/ComingSeasonBanner";
import { DailyMissionsBanner } from "./banners/DailyMissionsBanner";
import { LeaderboardBanner } from "./banners/LeaderboardBanner";

export const NewHome = () => {
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
  };

  return (
    <DelayedLoading ms={100}>
      <MobileDecoration />
{/*       <RemoveScroll>
        <></>
      </RemoveScroll> */}
      <Flex
        height="100%"
        width={"100%"}
        justifyContent="space-between"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          gap={{ base: 6, sm: 8, md: 6 }}
          w={"100%"}
          zIndex={1}
          mt={4}
        >
          <Flex
            w={"100%"}
            h={"100%"}
            justifyContent="center"
            minH={isSmallScreen ? "unset" : "40vh"}
            flexGrow={1}
            flexDir="column"
            px={isSmallScreen ? 2 : 8}
            gap={3}
          >
            <Flex h={isSmallScreen ? "120px" : "250px"} w="100%" justifyContent={"space-between"}>
              <Flex w={isSmallScreen ? "240px" : "500px"} justifyContent={"flex-start"} alignItems="start">
                <SpineAnimation
                  jsonUrl={`/spine-animations/logo/JokerLogo.json`}
                  atlasUrl={`/spine-animations/logo/JokerLogo.atlas`}
                  initialAnimation={"animation"}
                  loopAnimation={"animation"}
                  scale={2.5}
                  yOffset={-800}
                />
              </Flex>
              <Flex
                w={isSmallScreen ? "90px" : "200px"}
                justifyContent={"flex-end"}
                mr={isSmallScreen ? 2 : 8}
                mt={isSmallScreen ? 2 : 8}
                alignItems="start"
              >
                <ProfileTile />
              </Flex>
            </Flex>
            <Flex flexDir={isSmallScreen ? "column" : "row"} gap={3}>
              <LeaderboardBanner />
              <DailyMissionsBanner />
              <ComingSeasonBanner />
            </Flex>
          </Flex>
          {!isSmallScreen && (
            <Flex gap={8} position="absolute" bottom={'90px'}>
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
