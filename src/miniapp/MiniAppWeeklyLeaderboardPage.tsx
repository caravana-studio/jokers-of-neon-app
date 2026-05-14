import {
  Box,
  Flex,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "../components/Clock";
import { CustomTr } from "../components/Leaderboard";
import { DelayedLoading } from "../components/DelayedLoading";
import CachedImage from "../components/CachedImage";
import { MobileDecoration } from "../components/MobileDecoration";
import { useGetApiLeaderboard } from "../queries/useGetApiLeaderboard";
import { VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { formatNumber } from "../utils/formatNumber";
import { getCurrentGameLeaderboardPeriods } from "../utils/leaderboardPeriods";
import { addressKey } from "../utils/starknetAddress";
import { getMiniAppBlockchain, useMiniAppIdentity } from "./session/useMiniAppSession";

const CURRENT_LEADER_STYLES = {
  position: "relative",
  borderTop: "1px solid white",
  borderBottom: "1px solid white",
  backgroundColor: "black",
  color: "white !important",
};

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
  const { userAddress } = useMiniAppIdentity();
  const periods = useMemo(() => getCurrentGameLeaderboardPeriods(now), [now]);

  const { data, isLoading, error } = useGetApiLeaderboard({
    blockchain: getMiniAppBlockchain(),
    startDate: periods.weekly.startDate,
    endDate: periods.weekly.endDate,
    isTournament: false,
    limit: 50,
  });

  const currentUserAddress = addressKey(userAddress);
  const entries = data?.entries ?? [];
  const topEntries = entries.slice(0, 3);
  const tableEntries = entries.slice(3);

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
                  px={isSmallScreen ? 4 : 8}
                >
                  {!entries.length ? (
                    <Flex justifyContent="center" pt={6}>
                      <Text color="white">{t("title")}</Text>
                    </Flex>
                  ) : (
                    <TableContainer overflowX="hidden" overflowY="auto">
                      <Table
                        variant="leaderboard"
                        sx={{
                          borderCollapse: "separate",
                          borderSpacing: "0 5px",
                          tableLayout: "fixed",
                          "& td": {
                            border: "none",
                            padding: 0,
                            overflow: "hidden",
                          },
                        }}
                      >
                        <Tbody>
                          {tableEntries.map((entry) => {
                            const isCurrentPlayer =
                              Boolean(currentUserAddress) &&
                              addressKey(entry.owner) === currentUserAddress;

                            return (
                              <CustomTr
                                key={entry.id}
                                highlighted={isCurrentPlayer}
                                sx={isCurrentPlayer ? CURRENT_LEADER_STYLES : {}}
                              >
                                <Td w={isSmallScreen ? "50px" : "70px"}>
                                  #{entry.position}
                                </Td>
                                <Td color="white !important">
                                  <Text>{entry.displayName}</Text>
                                </Td>
                                <Td maxW="150px" p="12px 20px" whiteSpace="normal">
                                  <Text
                                    color={
                                      isCurrentPlayer
                                        ? "white !important"
                                        : VIOLET_LIGHT
                                    }
                                    fontSize={isSmallScreen ? 10 : 14}
                                    overflowWrap="break-word"
                                    wordBreak="normal"
                                    whiteSpace="normal"
                                    lineHeight="1.2"
                                  >
                                    {t("level")}
                                    {entry.level}
                                    {" - "}
                                    {t("round")}
                                    {entry.round}
                                    <br />
                                    {formatNumber(entry.playerScore)} {t("points")}
                                  </Text>
                                </Td>
                              </CustomTr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
