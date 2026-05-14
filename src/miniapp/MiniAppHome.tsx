import { Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import SpineAnimation from "../components/SpineAnimation";
import { useGameContext } from "../providers/GameProvider";
import { useDistributionSettings } from "../queries/useDistributionSettings";
import { useGetMyGames } from "../queries/useGetMyGames";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { ensureMiniAppSession, getMiniAppBlockchain } from "./session/useMiniAppSession";
import { MiniAppBannerRenderer } from "./MiniAppBannerRenderer";

export const MiniAppHome = () => {
  const { t } = useTranslation(["home"]);
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { settings } = useDistributionSettings();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const { data: games } = useGetMyGames();
  const banners = settings?.miniapp?.banners ?? [];

  useEffect(() => {
    if (getMiniAppBlockchain() === "starknet") {
      return;
    }

    void ensureMiniAppSession().catch((error) => {
      console.error("Failed to preload game loop burner session", error);
    });
  }, []);

  const hasGames = Boolean(games && games.length > 0);

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

  const handlePlayClick = () => {
    if (hasGames) {
      navigate("/my-games");
      return;
    }

    handleCreateGame();
  };

  return (
    <DelayedLoading ms={100}>
      <MobileDecoration />
      <Flex
        height="100%"
        width="100%"
        justifyContent="space-between"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          w="100%"
          zIndex={1}
          px={{ base: 3, sm: 4, md: 8 }}
          pt={{ base: 4, md: 8 }}
          flexGrow={1}
        >
          <Flex
            w="100%"
            justifyContent="center"
            minH={isSmallScreen ? "110px" : "200px"}
            maxW={isSmallScreen ? "260px" : "420px"}
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
            w="100%"
            maxW={isSmallScreen ? "100%" : "640px"}
            flexDirection="column"
            gap={3}
            mt={-4}
          >
            {banners.map((banner) => (
              <MiniAppBannerRenderer key={banner.id} banner={banner} />
            ))}
          </Flex>

          {!isSmallScreen && (
            <Flex pt={2}>
              <Button
                onClick={handlePlayClick}
                minW="280px"
                variant="secondarySolid"
              >
                {hasGames ? t("my-games") : t("play")}
              </Button>
            </Flex>
          )}
        </Flex>

        {isSmallScreen ? (
          <MobileBottomBar
            firstButton={{
              label: hasGames ? t("my-games") : t("play"),
              onClick: handlePlayClick,
            }}
          />
        ) : (
          <Flex h="50px" />
        )}
      </Flex>
    </DelayedLoading>
  );
};
