import {
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "../components/Clock";
import { DelayedLoading } from "../components/DelayedLoading";
import CachedImage from "../components/CachedImage";
import { MobileDecoration } from "../components/MobileDecoration";
import { VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { formatNumber } from "../utils/formatNumber";
import { MiniAppLeaderboardTable } from "./leaderboard/MiniAppLeaderboardTable";
import { useMiniAppWeeklyLeaderboard } from "./leaderboard/useMiniAppWeeklyLeaderboard";

const MiniAppLeaderboardPodium = ({
  entries,
}: {
  entries: Array<{
    displayName: string;
    playerScore: number;
    level: number;
    round: number;
  }>;
}) => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const leaders = entries.slice(0, 3);

  const renderStats = (index: number) => (
    <Flex flexDir="column" gap={isSmallScreen ? 0 : 1} alignItems="center">
      <Flex gap={2}>
        <Text color="lightViolet">
          {t("level")}
          {leaders[index].level}
        </Text>
        <Text color="white">
          {t("round")}
          {leaders[index].round}
        </Text>
      </Flex>
      <Text color={VIOLET_LIGHT}>
        {formatNumber(leaders[index].playerScore)} {t("points")}
      </Text>
    </Flex>
  );

  return (
    <Flex
      w={isSmallScreen ? "220px" : "400px"}
      mt={isSmallScreen ? 6 : "-100px"}
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <CachedImage src="/leaderboard/podium.png" />
      {leaders[0] && (
        <>
          <Text
            position="absolute"
            left={isSmallScreen ? "75px" : "130px"}
            top={isSmallScreen ? "10px" : "25px"}
            width={isSmallScreen ? "70px" : "140px"}
            textAlign="center"
            lineHeight={0.9}
            fontWeight="bold"
          >
            {leaders[0].displayName}
          </Text>
          <Flex
            position="absolute"
            left={isSmallScreen ? "75px" : "130px"}
            top={isSmallScreen ? "120px" : "220px"}
            width={isSmallScreen ? "70px" : "140px"}
            justifyContent="center"
            lineHeight={1.1}
            gap={1}
            fontWeight="bold"
          >
            {renderStats(0)}
          </Flex>
        </>
      )}
      {leaders[1] && (
        <>
          <Text
            position="absolute"
            left={isSmallScreen ? "5px" : "-2px"}
            top={isSmallScreen ? "55px" : "110px"}
            width={isSmallScreen ? "70px" : "140px"}
            textAlign="center"
            lineHeight={0.9}
            fontWeight="bold"
          >
            {leaders[1].displayName}
          </Text>
          <Flex
            position="absolute"
            left={isSmallScreen ? "5px" : "0px"}
            top={isSmallScreen ? "160px" : "295px"}
            width={isSmallScreen ? "70px" : "140px"}
            justifyContent="center"
            lineHeight={1.1}
            gap={1}
            fontWeight="bold"
          >
            {renderStats(1)}
          </Flex>
        </>
      )}
      {leaders[2] && (
        <>
          <Text
            position="absolute"
            left={isSmallScreen ? "145px" : "260px"}
            top={isSmallScreen ? "84px" : "162px"}
            width={isSmallScreen ? "70px" : "140px"}
            textAlign="center"
            lineHeight={0.9}
            fontWeight="bold"
          >
            {leaders[2].displayName}
          </Text>
          <Flex
            position="absolute"
            left={isSmallScreen ? "145px" : "260px"}
            top={isSmallScreen ? "173px" : "320px"}
            width={isSmallScreen ? "70px" : "140px"}
            justifyContent="center"
            lineHeight={1.1}
            gap={1}
            fontWeight="bold"
          >
            {renderStats(2)}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export const MiniAppWeeklyLeaderboardPage = () => {
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const [now, setNow] = useState(() => new Date());
  const { periods, entries, currentUserAddress, isLoading, error } =
    useMiniAppWeeklyLeaderboard(now);
  const topEntries = entries.slice(0, 3);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <DelayedLoading ms={200}>
      <MobileDecoration />
      <Flex w="100%" h="100%" flexDir="column" alignItems="center">
        <Flex w={isSmallScreen ? "100%" : "70%"} h="100%" flexDir="column" minH={0}>
          <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            px={isSmallScreen ? 4 : 6}
            pt={6}
            pb={2}
          >
            <Heading
              variant="italic"
              fontSize={isSmallScreen ? "sm" : "md"}
              textTransform="uppercase"
            >
              {t("title")}
            </Heading>
            <Clock date={periods.weekly.resetAt} />
          </Flex>
          <Flex
            flexGrow={1}
            minH={0}
            flexDir="column"
            overflowY="auto"
            alignItems="center"
            pb={isSmallScreen ? "100px" : "200px"}
          >
            {isLoading ? (
              <Flex flexGrow={1} alignItems="center" justifyContent="center" pt={8}>
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex flexGrow={1} alignItems="center" justifyContent="center" pt={8}>
                <Text textAlign="center" color="white">
                  {error instanceof Error ? error.message : "Could not load leaderboard"}
                </Text>
              </Flex>
            ) : (
              <>
                {topEntries.length > 0 && (
                  <MiniAppLeaderboardPodium entries={topEntries} />
                )}
                <Box
                  w={isSmallScreen ? "100%" : "78%"}
                  mt={2}
                >
                  <MiniAppLeaderboardTable
                    entries={entries.slice(3)}
                    currentUserAddress={currentUserAddress}
                    lines={47}
                    isSmallScreen={Boolean(isSmallScreen)}
                    t={t}
                    px={isSmallScreen ? 4 : 8}
                  />
                </Box>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
