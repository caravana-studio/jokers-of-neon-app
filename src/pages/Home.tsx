import { Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { RemoveScroll } from "react-remove-scroll";
import { useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import SpineAnimation from "../components/SpineAnimation";
import { useGameContext } from "../providers/GameProvider";
import { useGetMyGames } from "../queries/useGetMyGames";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const Home = () => {
  const { t } = useTranslation(["home"]);
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const { data: games } = useGetMyGames();

  const handleCreateGame = async () => {
    prepareNewGame();
    executeCreateGame();
    navigate("/entering-tournament");
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
                onClick={() => {
                  games.length > 0 ? navigate("/my-games") : handleCreateGame();
                }}
                w="300px"
                variant="secondarySolid"
              >
                {games.length > 0 ? t("my-games") : t("play")}
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
              label: games.length > 0 ? t("my-games") : t("play"),
              onClick: () => {
                games.length > 0 ? navigate("/my-games") : handleCreateGame();
              },
            }}
          />
        ) : (
          <Flex h="50px" />
        )}
      </Flex>
    </DelayedLoading>
  );
};
