import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Preferences } from "@capacitor/preferences";
import { useNavigate } from "react-router-dom";
import { BannerRenderer } from "../../components/BannerRenderer/BannerRenderer";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { ProfileTile } from "../../components/ProfileTile";
import SpineAnimation from "../../components/SpineAnimation";
import { SKIPPED_VERSION } from "../../constants/localStorage";
import { APP_VERSION } from "../../constants/version";
import { useGameContext } from "../../providers/GameProvider";
import { fetchVersion } from "../../queries/fetchVersion";
import { useDistributionSettings } from "../../queries/useDistributionSettings";
import { useGetMyGames } from "../../queries/useGetMyGames";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { logEvent } from "../../utils/analytics";
import { APP_URL, isNative } from "../../utils/capacitorUtils";
import { getMinor } from "../../utils/versionUtils";

export const NewHome = () => {
  const { t } = useTranslation(["home"]);
  const { isSmallScreen } = useResponsiveValues();
  const { settings, loading } = useDistributionSettings();
  const navigate = useNavigate();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const { data: games } = useGetMyGames();

  const [isTutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [isVersionModalOpen, setVersionModalOpen] = useState(false);
  const [version, setVersion] = useState<string | null>(null);

  const banners = settings?.home?.banners || [];

  useEffect(() => {
    logEvent("open_home_page");
    if (isNative) {
      fetchVersion().then(async (version) => {
        setVersion(version);
        try {
          const res = await Preferences.get({ key: SKIPPED_VERSION });
          const skipped = res.value;
          if (
            Number(getMinor(version)) > Number(getMinor(APP_VERSION)) &&
            skipped !== version
          ) {
            setVersionModalOpen(true);
          }
        } catch (e) {
          console.warn("Preferences.get failed for SKIPPED_VERSION", e);
        }
      });
    }
  }, []);

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

  const handleConfirmUpdate = () => {
    window.open(APP_URL, "_blank");
  };

  const handleSkipVersion = async () => {
    setVersionModalOpen(false);
    if (version) {
      try {
        await Preferences.set({ key: SKIPPED_VERSION, value: version });
      } catch (e) {
        // ignore preferences error; nothing we can do in UI
      }
    }
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
              {banners[2] && isSmallScreen && (
                <BannerRenderer banner={banners[2]} />
              )}
            </Flex>
          </Flex>
        </Flex>
        {!isSmallScreen && (
          <Flex position="absolute" bottom="90px">
            <Button
              onClick={handlePlayClick}
              w="300px"
              variant="secondarySolid"
            >
              {games && games.length > 0 ? t("my-games") : t("play")}
            </Button>
          </Flex>
        )}
        {isSmallScreen && (
          <MobileBottomBar
            firstButton={{
              label: games && games.length > 0 ? t("my-games") : t("play"),
              onClick: handlePlayClick,
            }}
          />
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
      {isVersionModalOpen && (
        <ConfirmationModal
          close={handleSkipVersion}
          title={t("versionModal.title")}
          description={t("versionModal.description")}
          confirmText={t("versionModal.confirm-text")}
          cancelText={t("versionModal.cancel-text")}
          onConfirm={handleConfirmUpdate}
        />
      )}
    </DelayedLoading>
  );
};
