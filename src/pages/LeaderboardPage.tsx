import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CountdownTimer from "../components/CountdownTimer";
import { DelayedLoading } from "../components/DelayedLoading";
import { GoBackButton } from "../components/GoBackButton";
import { Leaderboard } from "../components/Leaderboard";
import { MobileDecoration } from "../components/MobileDecoration";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const LeaderBoardPage = () => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();

  const tournamentEnabled = useFeatureFlagEnabled(
    "global",
    "tournamentEnabled"
  );

  return (
    <DelayedLoading ms={100}>
      <MobileDecoration />
      <Flex
        height="100%"
        width="100%"
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
          {!isSmallScreen && <GoBackButton mt={8} width={"100%"} />}
        </Box>
      </Flex>
    </DelayedLoading>
  );
};
