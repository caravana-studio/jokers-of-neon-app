import { Divider, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Clock } from "../../components/Clock";
import { DelayedLoading } from "../../components/DelayedLoading";
import { Leaderboard } from "../../components/Leaderboard";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useTournamentSettings } from "../../queries/useTournamentSettings";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const NewLeaderboardPage = () => {
  const { tournament } = useTournamentSettings();
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  return (
    <DelayedLoading ms={200}>
      <MobileDecoration />
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Flex
          w="100%"
          flexDir="column"
          h="50px"
          mt={isSmallScreen ? 6 : "70px"}
          minHeight={0}
        >
          <Flex
            w="100%"
            h="30px"
            justifyContent="space-between"
            alignItems="center"
            px={4}
          >
            <Heading variant="italic" fontSize={isSmallScreen ? "sm" : "md"}>
              {tournament?.isActive ? t("tournament") : t("title")}
            </Heading>
            {tournament?.endDate && tournament.isActive && (
              <Clock date={tournament.endDate} />
            )}
          </Flex>
          <Divider borderColor={BLUE} mt={3} />
        </Flex>
        <Leaderboard lines={101} />
      </Flex>
    </DelayedLoading>
  );
};
