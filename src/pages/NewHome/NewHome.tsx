import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { BannerRenderer } from "../../components/BannerRenderer/BannerRenderer";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { ProfileTile } from "../../components/ProfileTile";
import SpineAnimation from "../../components/SpineAnimation";
import { useGameContext } from "../../providers/GameProvider";
import { useDistributionSettings } from "../../queries/useDistributionSettings";
import { useGetMyGames } from "../../queries/useGetMyGames";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const NewHome = () => {
  const { t } = useTranslation(["home"]);
  const { isSmallScreen } = useResponsiveValues();
  const { settings, loading } = useDistributionSettings();
  const navigate = useNavigate();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const { data: games } = useGetMyGames();

  const [isTutorialModalOpen, setTutorialModalOpen] = useState(false);

  const banners = settings?.home?.banners || [];

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
            <Flex
              h={isSmallScreen ? "120px" : "250px"}
              w="100%"
              justifyContent={"space-between"}
            >
              <Flex
                w={isSmallScreen ? "240px" : "500px"}
                justifyContent={"flex-start"}
                alignItems="start"
              >
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
            <Flex flexDir={"column"} gap={3} alignItems={"center"} w="100%">
              <Flex flexDir={isSmallScreen ? "column" : "row"} gap={3} w="100%">
                {banners[0] && <BannerRenderer banner={banners[0]} />}
                {banners[1] && <BannerRenderer banner={banners[1]} />}
              </Flex>
              {banners[2] && <BannerRenderer banner={banners[2]} />}
            </Flex>
          </Flex>
        </Flex>

        <Flex h="50px" />
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
