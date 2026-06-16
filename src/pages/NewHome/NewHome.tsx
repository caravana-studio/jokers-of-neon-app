import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Preferences } from "@capacitor/preferences";
import { useLocation, useNavigate } from "react-router-dom";
import { claimStreakPresentation } from "../../api/profile";
import { BannerRenderer } from "../../components/BannerRenderer/BannerRenderer";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DelayedLoading } from "../../components/DelayedLoading";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { FreePack } from "../../components/FreePack";
import { GuestLoginModal } from "../../components/GuestLoginModal";
import { IconComponent } from "../../components/IconComponent";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { ProfileTile } from "../../components/ProfileTile";
import SpineAnimation from "../../components/SpineAnimation";
import { UnclaimedRewards } from "../../components/UnclaimedRewards";
import { XpBoosterModal } from "../../components/XpBoosterModal";
import { Icons } from "../../constants/icons";
import {
  GUEST_LOGIN_MODAL_SHOWN,
  SKIPPED_VERSION,
} from "../../constants/localStorage";
import { useSeasonNumber } from "../../constants/season";
import { APP_VERSION } from "../../constants/version";
import { useDojo } from "../../dojo/DojoContext";
import { useGameContext } from "../../providers/GameProvider";
import { fetchVersion } from "../../queries/fetchVersion";
import { useDistributionSettings } from "../../queries/useDistributionSettings";
import { useGetMyGames } from "../../queries/useGetMyGames";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { logEvent } from "../../utils/analytics";
import { APP_URL, isNative } from "../../utils/capacitorUtils";
import { hasInProgressGames } from "../../utils/inProgressGames";
import {
  isStreakHidden,
  navigateToStreakIncreased,
  SKIP_STREAK_PRESENTATION_CHECK,
} from "../../utils/streakPresentation";
import { getMajor, getMinor, getPatch } from "../../utils/versionUtils";

const bossFloatAnimation = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -26px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const DESKTOP_BANNER_MIN_FIT_SCALE = 0.55;

export const NewHome = () => {
  const { t } = useTranslation(["home"]);
  const { t: tCommon } = useTranslation("intermediate-screens", {
    keyPrefix: "common",
  });
  const { isSmallScreen } = useResponsiveValues();
  const { settings } = useDistributionSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const { data: games } = useGetMyGames();
  const hasActiveGames = hasInProgressGames(games);
  const seasonNumber = useSeasonNumber();

  const [isVersionModalOpen, setVersionModalOpen] = useState(false);
  const [isGuestLoginModalOpen, setGuestLoginModalOpen] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const [hasUnclaimedRewards, setHasUnclaimedRewards] = useState(false);
  const [desktopBannerScale, setDesktopBannerScale] = useState(1);
  const [isDesktopBannerScrollable, setIsDesktopBannerScrollable] =
    useState(false);
  const desktopBannerViewportRef = useRef<HTMLDivElement | null>(null);
  const desktopBannerContentRef = useRef<HTMLDivElement | null>(null);
  const streakCheckAddressRef = useRef<string | null>(null);

  const banners = settings?.home?.banners || [];
  const desktopBannerFitKey = banners
    .map((banner, index) => `${banner.type}-${banner.endTime ?? "no-end"}-${index}`)
    .join("|");
  const {
    setup: { useBurnerAcc },
    account,
  } = useDojo();

  const desktopBannerWidth =
    desktopBannerScale < 0.9
      ? "40vw"
      : desktopBannerScale < 0.97
        ? "38vw"
        : "36vw";

  useEffect(() => {
    logEvent("open_home_page");
    if (isNative) {
      fetchVersion().then(async (data) => {
        const version = data.version;
        setVersion(version);
        try {
          const res = await Preferences.get({ key: SKIPPED_VERSION });
          const skipped = res.value;
          if (
            Number(getMajor(version)) === Number(getMajor(APP_VERSION)) &&
            Number(getMinor(version)) === Number(getMinor(APP_VERSION)) &&
            Number(getPatch(version)) > Number(getPatch(APP_VERSION)) &&
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

  useEffect(() => {
    if (isStreakHidden) {
      return;
    }

    if (
      (location.state as Record<string, unknown> | null)?.[
        SKIP_STREAK_PRESENTATION_CHECK
      ] === true
    ) {
      return;
    }

    const address = account?.account?.address;
    if (!address || streakCheckAddressRef.current === address) {
      return;
    }

    streakCheckAddressRef.current = address;
    let active = true;

    void (async () => {
      try {
        const presentation = await claimStreakPresentation(address);

        if (
          active &&
          presentation.show &&
          presentation.streak !== null
        ) {
          const navigated = navigateToStreakIncreased(navigate, {
            streak: presentation.streak,
            continuation: {
              type: "route",
              to: "/",
              replace: true,
              state: {
                [SKIP_STREAK_PRESENTATION_CHECK]: true,
              },
            },
            replace: true,
          });

          if (navigated) {
            return;
          }
        }
      } catch (error) {
        console.warn("NewHome: streak presentation claim failed", error);
      }
    })();

    return () => {
      active = false;
    };
  }, [account?.account?.address, location.state, navigate]);

  useEffect(() => {
    if (!useBurnerAcc) return;

    const checkGuestModal = async () => {
      try {
        const res = await Preferences.get({
          key: GUEST_LOGIN_MODAL_SHOWN,
        });
        if (res.value !== "hidden") {
          setGuestLoginModalOpen(true);
        }
      } catch (error) {
        console.warn("Preferences.get failed for guest modal", error);
        try {
          const stored = window.localStorage.getItem(GUEST_LOGIN_MODAL_SHOWN);
          if (stored !== "hidden") {
            setGuestLoginModalOpen(true);
          }
        } catch (storageError) {
          console.warn("localStorage failed for guest modal", storageError);
          setGuestLoginModalOpen(true);
        }
      }
    };

    checkGuestModal();
  }, [useBurnerAcc]);

  useLayoutEffect(() => {
    if (isSmallScreen) {
      setDesktopBannerScale(1);
      setIsDesktopBannerScrollable(false);
      return;
    }

    const viewport = desktopBannerViewportRef.current;
    const content = desktopBannerContentRef.current;

    if (!viewport || !content) {
      return;
    }

    const fitBannersToViewport = () => {
      const viewportStyles = window.getComputedStyle(viewport);
      const paddingTop = Number.parseFloat(viewportStyles.paddingTop || "0") || 0;
      const paddingBottom =
        Number.parseFloat(viewportStyles.paddingBottom || "0") || 0;
      const availableHeight = Math.max(
        0,
        viewport.clientHeight - paddingTop - paddingBottom
      );
      const contentHeight = content.scrollHeight;

      if (!availableHeight || !contentHeight) {
        setDesktopBannerScale(1);
        return;
      }

      const fitScale = availableHeight / contentHeight;
      const shouldScroll = fitScale < DESKTOP_BANNER_MIN_FIT_SCALE;
      const nextScale = shouldScroll ? 1 : Math.min(1, fitScale);

      setDesktopBannerScale((prevScale) =>
        Math.abs(prevScale - nextScale) < 0.01 ? prevScale : nextScale
      );
      setIsDesktopBannerScrollable((prevShouldScroll) =>
        prevShouldScroll === shouldScroll ? prevShouldScroll : shouldScroll
      );
    };

    fitBannersToViewport();

    const resizeObserver = new ResizeObserver(() => {
      fitBannersToViewport();
    });

    resizeObserver.observe(viewport);
    resizeObserver.observe(content);
    window.addEventListener("resize", fitBannersToViewport);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", fitBannersToViewport);
    };
  }, [isSmallScreen, desktopBannerFitKey]);

  const handleCreateGame = () => {
    prepareNewGame();
    const createGamePromise = executeCreateGame();
    navigate("/entering-tournament");

    void createGamePromise.then((started) => {
      if (!started) {
        navigate("/my-games", { replace: true });
      }
    });
  };

  const handlePlayClick = () => {
    if (hasActiveGames) {
      navigate("/my-games");
    } else {
      handleCreateGame();
    }
  };

  const handleGuestLoginClick = () => {
    setGuestLoginModalOpen(false);
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleOpenGuestLoginModal = () => {
    setGuestLoginModalOpen(true);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
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

  return (
    <DelayedLoading ms={100}>
      <XpBoosterModal />
      {(useBurnerAcc || !hasUnclaimedRewards) && (
        <FreePack
          onClaimClick={useBurnerAcc ? handleOpenGuestLoginModal : undefined}
        />
      )}
      {!useBurnerAcc && (
        <UnclaimedRewards
          onRewardsAvailabilityChange={setHasUnclaimedRewards}
        />
      )}
      <PositionedDiscordLink />
      <MobileDecoration />
      {/*       <RemoveScroll>
        <></>
      </RemoveScroll> */}
      <Flex
        height="100%"
        width={"100%"}
        position="relative"
      >
        {isSmallScreen ? (
          <Flex
            justifyContent="space-between"
            flexDirection="column"
            alignItems="center"
            gap={4}
            h="100%"
            w="100%"
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
                minH="unset"
                flexGrow={1}
                flexDir="column"
                px={2}
                gap={3}
              >
                <Flex h="120px" w="100%" justifyContent={"space-between"}>
                  <Flex
                    w="240px"
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
                    w="auto"
                    flexDir="column"
                    justifyContent="flex-start"
                    mr={2}
                    mt={2}
                    alignItems="flex-end"
                    gap={1.5}
                  >
                    {!useBurnerAcc && <ProfileTile />}
                    {useBurnerAcc && (
                      <Button
                        size="xs"
                        onClick={handleLoginClick}
                      >
                        {tCommon("login")}
                      </Button>
                    )}
                    <Flex
                      alignItems="center"
                      gap={1}
                      cursor="pointer"
                      onClick={handleSettingsClick}
                      mt={useBurnerAcc ? 1 : 0}
                    >
                      <IconComponent
                        icon={Icons.SETTINGS}
                        width="22px"
                        height="22px"
                      />
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  flexDir={"column"}
                  gap={1.5}
                  alignItems={"center"}
                  w="100%"
                  mt="-25px"
                >
                  <Flex flexDir="column" gap={1.5} w="100%">
                    {banners[0] && <BannerRenderer banner={banners[0]} />}
                    {banners[1] && <BannerRenderer banner={banners[1]} />}
                  </Flex>
                  {banners[2] && <BannerRenderer banner={banners[2]} />}
                </Flex>
              </Flex>
            </Flex>
            <MobileBottomBar
              firstButton={{
                label: hasActiveGames ? t("my-games") : t("play"),
                onClick: handlePlayClick,
              }}
            />
          </Flex>
        ) : (
          <Flex
            h="100%"
            w="100%"
            position="relative"
            overflow="hidden"
            pt={10}
            pb="140px"
            px={8}
            gap={5}
          >
            <Flex
              position="absolute"
              left="18px"
              bottom="-30px"
              h={{ base: "65%", md: "75%", lg: "80%", xl: "88%" }}
              maxW={{ base: "48vw", md: "53vw", lg: "58vw" }}
              zIndex={2}
              pointerEvents="none"
              justifyContent="flex-start"
              alignItems="flex-end"
            >
              <Image
                src={`/boss/s${seasonNumber}.png`}
                h="100%"
                w="auto"
                maxW="100%"
                objectFit="contain"
                objectPosition="left bottom"
                animation={`${bossFloatAnimation} 6.8s ease-in-out infinite`}
                transformOrigin="left bottom"
                willChange="transform"
              />
            </Flex>

            <Flex flex="1 1 0" minW={0} position="relative">
              <Flex
                position="absolute"
                top="-8px"
                left={{ lg: "85px", xl: "110px" }}
                flexDir="column"
                alignItems="center"
                zIndex={1}
              >
                <Flex
                  w="500px"
                  h="250px"
                  justifyContent="flex-start"
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
              </Flex>

              <Text
                position="absolute"
                top="190px"
                left={{ base: "50px", lg: "85px", xl: "110px" }}
                w="500px"
                textAlign="center"
                fontFamily="Sonara"
                fontStyle="italic"
                fontSize={{ base: "24px", md: "28px", lg: "30px", xl: "34px" }}
                lineHeight={1}
                color="white"
                textTransform="uppercase"
                textShadow="0 0 10px black"
                zIndex={3}
              >
                SEASON {seasonNumber}
              </Text>

              {!useBurnerAcc && (
                <Flex
                  position="absolute"
                  left="-12px"
                  bottom={{ lg: "70px", xl: "80px" }}
                  zIndex={1001}
                >
                  <ProfileTile />
                </Flex>
              )}
            </Flex>

            <Flex
              flex="0 1 auto"
              w={desktopBannerWidth}
              maxW="40vw"
              minW="28vw"
              h="100%"
              zIndex={3}
              pt={16}
              mr={6}
              ref={desktopBannerViewportRef}
              overflowX="hidden"
              overflowY={isDesktopBannerScrollable ? "auto" : "hidden"}
              sx={{
                scrollbarGutter: "stable",
              }}
            >
              <Flex
                ref={desktopBannerContentRef}
                w="100%"
                flexDir="column"
                gap={3}
                pr={1}
                transform={
                  isDesktopBannerScrollable
                    ? "none"
                    : `scale(${desktopBannerScale})`
                }
                transformOrigin="top right"
                transition="transform 0.2s ease-out"
              >
                {banners.map((banner, index) => (
                  <BannerRenderer
                    key={`${banner.type}-${banner.endTime ?? "no-end"}-${index}`}
                    banner={banner}
                  />
                ))}
              </Flex>
            </Flex>

            {useBurnerAcc && (
              <Flex position="absolute" right="50px" top="36px" zIndex={5}>
                <Button size="sm" onClick={handleLoginClick}>
                  {tCommon("login")}
                </Button>
              </Flex>
            )}

            <Flex
              position="absolute"
              bottom="90px"
              left="50%"
              transform="translateX(-50%)"
              zIndex={4}
            >
              <Button
                onClick={handlePlayClick}
                w="300px"
                variant="secondarySolid"
              >
                {hasActiveGames ? t("my-games") : t("play")}
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
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
      {useBurnerAcc && (
        <GuestLoginModal
          isOpen={isGuestLoginModalOpen}
          onClose={() => setGuestLoginModalOpen(false)}
          onLogin={handleGuestLoginClick}
        />
      )}
    </DelayedLoading>
  );
};
