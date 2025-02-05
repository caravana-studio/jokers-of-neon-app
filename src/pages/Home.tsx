import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import { Background } from "../components/Background";
import CountdownTimer from "../components/CountdownTimer";
import { DiscordLink } from "../components/DiscordLink";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Leaderboard } from "../components/Leaderboard";
import { PoweredBy } from "../components/PoweredBy";
import SpineAnimation from "../components/SpineAnimation";
import { CLASSIC_MOD_ID } from "../constants/general";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const Home = () => {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation(["home"]);
  const { setModId } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();

  const tournamentEnabled = useFeatureFlagEnabled(
    "global",
    "tournamentEnabled"
  );

  useEffect(() => {
    setModId(CLASSIC_MOD_ID);
  }, []);

  const enableMods = useFeatureFlagEnabled("global", "showMods");

  return (
    <Background type="home">
      <AudioPlayer />
      <LanguageSwitcher />
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        {leaderboardOpen ? (
          <Box>
            <Heading mb={"10px"} size="l" variant="italic" textAlign={"center"}>
              LEADERBOARD
            </Heading>

            {tournamentEnabled && (
              <Box mb={10} textAlign={"center"}>
                <CountdownTimer
                  targetDate={new Date("2024-12-30T00:00:00.000Z")}
                />
              </Box>
            )}

            <Leaderboard />
            <Button
              mt={8}
              width="100%"
              onClick={() => {
                setLeaderboardOpen(false);
              }}
            >
              {t("leaderboard.btn.returnLeaderboard-btn")}
            </Button>
          </Box>
        ) : (
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
              justifyContent="center"
              minH={isSmallScreen ? "unset" : "40vh"}
              flexGrow={1}
              maxWidth={isMobile ? "70%" : "50%"}
            >
              <Flex h={"100%"} w="100%" justifyContent={"center"} pl={2}>
                <SpineAnimation
                  jsonUrl={`/spine-animations/logo/JokerLogo.json`}
                  atlasUrl={`/spine-animations/logo/JokerLogo.atlas`}
                  initialAnimation={"animation"}
                  loopAnimation={"animation"}
                  scale={2.8}
                  yOffset={-800}
                />
              </Flex>
            </Flex>

            <Flex
              gap={{ base: 4, sm: 6 }}
              flexWrap={{ base: "wrap", sm: "nowrap" }}
            >
              {!enableMods && (
                <Button
                  onClick={() => {
                    setLeaderboardOpen(true);
                  }}
                  minW={["150px", "300px"]}
                >
                  {t("home.btn.leaderboard-btn")}
                </Button>
              )}
              <Button
                variant="secondarySolid"
                onClick={() => {
                  if (enableMods) {
                    navigate("/mods");
                  } else {
                    //default to classic
                    setModId(CLASSIC_MOD_ID);
                    navigate("/login");
                  }
                }}
                minW={["150px", "300px"]}
              >
                {t(enableMods ? "home.btn.start" : "home.btn.playDemo-btn")}
              </Button>
            </Flex>
          </Flex>
        )}
        <PoweredBy />
      </Flex>
      <Box
        zIndex={999}
        position="absolute"
        left="15px"
        top="15px"
        cursor="pointer"
      >
        <DiscordLink />
      </Box>
    </Background>
  );
};
