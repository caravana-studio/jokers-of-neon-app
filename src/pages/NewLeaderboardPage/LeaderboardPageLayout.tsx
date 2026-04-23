import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AllTimeXpLeaderboard } from "../../components/AllTimeXpLeaderboard";
import { Clock } from "../../components/Clock";
import { DelayedLoading } from "../../components/DelayedLoading";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { Leaderboard } from "../../components/Leaderboard";
import { XpLeaderboard } from "../../components/XpLeaderboard";
import { useSeasonNumber } from "../../constants/season";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { useTournamentSettings } from "../../queries/useTournamentSettings";
import { VIOLET } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { GameLeaderboardTab } from "./GameLeaderboardTab";
import { Podium } from "./Podium";
import { SeePrizesSwitcher } from "./SeePrizesSwitcher";

type LeaderboardPageLayoutProps = {
  entriesSection?: ReactNode;
};

export const LeaderboardPageLayout = ({
  entriesSection,
}: LeaderboardPageLayoutProps) => {
  const { tournament } = useTournamentSettings();
  const { search } = useLocation();
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const [seePrizes, setSeePrizes] = useState(false);
  const [seeXpPrizes, setSeeXpPrizes] = useState(false);
  const seasonNumber = useSeasonNumber();
  const currentSeason = Math.max(1, Math.floor(seasonNumber));
  const [selectedXpSeason, setSelectedXpSeason] = useState(currentSeason);
  const isTournamentActive = Boolean(tournament?.isActive);
  const shouldShowTournamentTab =
    isTournamentActive || new URLSearchParams(search).has("seeTournament");

  useEffect(() => {
    setSelectedXpSeason((previousSeason) =>
      Math.max(1, Math.min(previousSeason, currentSeason))
    );
  }, [currentSeason]);

  const seasonOptions = useMemo(
    () => Array.from({ length: currentSeason }, (_, index) => index + 1),
    [currentSeason]
  );

  const tabs = [
    ...(shouldShowTournamentTab
      ? [
          <Tab key="tournament" title={t("tabs.tournament-leaderboard")}>
            <Flex w="100%" h="100%" flexDir="column" alignItems="center">
              <Flex
                flexDir="column"
                w="70%"
                h="100%"
                alignItems={"center"}
              >
                <Flex
                  px={isSmallScreen ? 2 : 6}
                  mb={isSmallScreen ? 2 : 4}
                  position="absolute"
                  right={{ base: 0, sm: 4 }}
                >
                  <Flex w={isSmallScreen ? "100px" : "150px"}>
                    {tournament?.endDate &&
                      tournament.isActive &&
                      !tournament.isFinished && (
                        <Clock date={tournament.endDate} />
                      )}
                  </Flex>
                  <SeePrizesSwitcher
                    onChange={(value) => setSeePrizes(value)}
                  />
                </Flex>
                <Flex
                  minH={0}
                  flexGrow={1}
                  flexDir="column"
                  w="100%"
                  alignItems={"center"}
                  justifyContent="flex-start"
                  overflowY="auto"
                  pt={isSmallScreen ? 2 : 4}
                >
                  <Flex
                    w="100%"
                    zIndex={10}
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent="flex-start"
                    mb={isSmallScreen ? 2 : 4}
                    flexShrink={0}
                  >
                    <Podium
                      seePrizes={seePrizes}
                      isTournamentLeaderboard
                      desktopMt={0}
                    />
                  </Flex>
                  <Box
                    w={isSmallScreen ? "100%" : "78%"}
                    minH={0}
                    flexShrink={0}
                  >
                    <Leaderboard
                      hidePodium
                      lines={100}
                      mb="0"
                      seePrizes={seePrizes}
                      isTournamentLeaderboard
                      fullWidth
                      compactSpacing
                    />
                  </Box>
                  <Box
                    w="100%"
                    h={isSmallScreen ? "100px" : "180px"}
                    flexShrink={0}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Tab>,
        ]
      : []),
    <Tab key="game" title={t("tabs.game-leaderboard")}>
      <GameLeaderboardTab isSmallScreen={isSmallScreen} />
    </Tab>,
    <Tab key="xp" title={t("tabs.xp-leaderboard")}>
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
        alignItems="center"
      >
        <Flex flexDir="column" w="70%" h="100%" alignItems={"center"}>
          <Flex
            minH={0}
            flexGrow={1}
            flexDir={isSmallScreen ? "column" : "row"}
            w="100%"
            gap={4}
            overflow="hidden"
            pb={isSmallScreen ? "100px" : "200px"}
          >
            <Flex flex={1} minH={0} flexDir="column" overflow="hidden">
              <Flex
                px={isSmallScreen ? 2 : 6}
                pt={2}
                pb={2}
                alignItems="center"
                gap={3}
                flexWrap="wrap"
              >
                <Heading variant="italic" fontSize={isSmallScreen ? "sm" : "md"}>
                  {t("sections.season")}
                </Heading>
                <Flex
                  role="radiogroup"
                  aria-label={t("sections.season")}
                  alignItems="center"
                  gap={2}
                  flexWrap="wrap"
                >
                  {seasonOptions.map((seasonId) => (
                    <Button
                      key={seasonId}
                      variant={
                        seasonId === selectedXpSeason ? "secondarySolid" : "ghost"
                      }
                      size={isSmallScreen ? "xs" : "sm"}
                      minW={isSmallScreen ? "28px" : "32px"}
                      px={2}
                      border={seasonId === selectedXpSeason ? "none" : "1px solid"}
                      borderColor={seasonId === selectedXpSeason ? "transparent" : "white"}
                      borderRadius="7px"
                      color="white"
                      bg={seasonId === selectedXpSeason ? undefined : "transparent"}
                      boxShadow={
                        seasonId === selectedXpSeason
                          ? `0px 0px 8px 2px ${VIOLET}`
                          : "none"
                      }
                      _hover={{
                        bg:
                          seasonId === selectedXpSeason
                            ? undefined
                            : "transparent",
                        boxShadow:
                          seasonId === selectedXpSeason
                            ? `0px 0px 8px 2px ${VIOLET}`
                            : `0px 0px 6px 1px ${VIOLET}`,
                        border:
                          seasonId === selectedXpSeason
                            ? "none"
                            : "1px solid white",
                        borderColor: seasonId === selectedXpSeason ? "transparent" : "white",
                      }}
                      _active={{
                        bg:
                          seasonId === selectedXpSeason
                            ? undefined
                            : "transparent",
                        boxShadow:
                          seasonId === selectedXpSeason
                            ? `0px 0px 8px 2px ${VIOLET}`
                            : `0px 0px 6px 1px ${VIOLET}`,
                        border:
                          seasonId === selectedXpSeason
                            ? "none"
                            : "1px solid white",
                        borderColor: seasonId === selectedXpSeason ? "transparent" : "white",
                      }}
                      aria-pressed={seasonId === selectedXpSeason}
                      onClick={() => {
                        setSelectedXpSeason(seasonId);
                      }}
                    >
                      {seasonId}
                    </Button>
                  ))}
                </Flex>
                <SeePrizesSwitcher
                  id="xp-see-prizes"
                  value={seeXpPrizes}
                  onChange={setSeeXpPrizes}
                />
              </Flex>
              <Flex flex={1} minH={0} overflowY="auto">
                <XpLeaderboard
                  lines={100}
                  mb="0"
                  seasonId={selectedXpSeason}
                  seePrizes={seeXpPrizes}
                  fullWidth
                  compactSpacing
                />
              </Flex>
            </Flex>
            <Flex flex={1} minH={0} flexDir="column" overflow="hidden">
              <Flex px={isSmallScreen ? 2 : 6} pt={isSmallScreen ? 0 : 2} pb={2}>
                <Heading variant="italic" fontSize={isSmallScreen ? "sm" : "md"}>
                  {t("sections.all-time")}
                </Heading>
              </Flex>
              <Flex flex={1} minH={0} overflowY="auto">
                <AllTimeXpLeaderboard
                  lines={100}
                  mb="0"
                  fullWidth
                  compactSpacing
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Tab>,
  ];

  return (
    <DelayedLoading ms={200}>
      <PositionedDiscordLink />
      <TabPattern mobileDecorationProps={{ fadeToBlack: true }} disableGoBack>
        {tabs}
      </TabPattern>
    </DelayedLoading>
  );
};
