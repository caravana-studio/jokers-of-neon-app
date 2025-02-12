import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import { Background } from "../components/Background";
import CountdownTimer from "../components/CountdownTimer";
import { DiscordLink } from "../components/DiscordLink";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Leaderboard } from "../components/Leaderboard";
import { PoweredBy } from "../components/PoweredBy";
import { CLASSIC_MOD_ID } from "../constants/general";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled";
import { useGameContext } from "../providers/GameProvider";

export const LeaderBoardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["home"]);
  const { setModId } = useGameContext();

  const tournamentEnabled = useFeatureFlagEnabled(
    "global",
    "tournamentEnabled"
  );

  useEffect(() => {
    setModId(CLASSIC_MOD_ID);
  }, []);

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
        <Box zIndex={1}>
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
              navigate(-1);
            }}
          >
            {t("leaderboard.btn.returnLeaderboard-btn")}
          </Button>
        </Box>

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
