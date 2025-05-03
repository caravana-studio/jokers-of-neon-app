import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BackgroundDecoration } from "../components/Background";
import CountdownTimer from "../components/CountdownTimer";
import { Leaderboard } from "../components/Leaderboard";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled";

export const LeaderBoardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });

  const tournamentEnabled = useFeatureFlagEnabled(
    "global",
    "tournamentEnabled"
  );

  return (
    <BackgroundDecoration>
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Box zIndex={1}>
          <Heading mb={10} size="l" variant="italic" textAlign={"center"}>
            {t("title")}
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
              navigate("/demo");
            }}
          >
            {t("btn.returnLeaderboard-btn")}
          </Button>
        </Box>
      </Flex>
    </BackgroundDecoration>
  );
};
