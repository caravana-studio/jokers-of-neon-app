import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Clock } from "../../components/Clock";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useTournamentSettings } from "../../queries/useTournamentSettings";
import { useSeasonProgressStore } from "../../state/useSeasonProgressStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { logEvent } from "../../utils/analytics";
import { Podium } from "../NewLeaderboardPage/Podium";
import { GamesListBox } from "./GamesListBox";
import { TournamentEntriesBar } from "./TournamentEntriesBar";

export const Tournament = () => {
  const { t: tTournament } = useTranslation("intermediate-screens", {
    keyPrefix: "tournament",
  });

  useEffect(() => {
    logEvent("open_tournament_page");
  }, []);

  const { isSmallScreen } = useResponsiveValues();
  const { tournament } = useTournamentSettings();
  const entries = useSeasonProgressStore((store) => store.tournamentEntries);
  const tournamentEndDate =
    tournament?.isActive && !tournament?.isFinished
      ? tournament?.endDate
      : undefined;

  const navigate = useNavigate();

  return (
    <DelayedLoading ms={100}>
      <MobileDecoration />
      <Flex
        direction="column"
        justifyContent={isSmallScreen ? "space-between" : "center"}
        alignItems="center"
        height="100%"
        width="100%"
        pt={[8, 12]}
        pb={[0, 4]}
      >
        <Flex
          flexDirection="column"
          // height={isSmallScreen ? "75%" : "60%"}
          width="100%"
          flexGrow={1}
          minH={0}
          justifyContent="center"
          alignItems="center"
        >
          <Flex
            width={{ base: "90%", sm: "70%", md: "900px" }}
            alignItems="center"
            justifyContent="space-between"
            zIndex={2}
            mb={3}
          >
            <Heading
              variant="italic"
              size={isSmallScreen ? "sm" : "md"}
            >
              {tTournament("title")}
            </Heading>
            {tournamentEndDate && (
              <Clock
                date={tournamentEndDate}
                fontSize={isSmallScreen ? 10 : 14}
                iconSize={isSmallScreen ? "10px" : "12px"}
              />
            )}
          </Flex>
          <Flex
            width={{ base: "90%", sm: "70%", md: "900px" }}
            flexDirection={{ base: "column", md: "row" }}
            alignItems="stretch"
            justifyContent="space-between"
            gap={isSmallScreen ? 4 : 8}
            zIndex={2}
            flexGrow={1}
            minH={0}
          >
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              w={{ base: "100%", md: "40%" }}
              gap={2}
            >
              <Podium isTournamentLeaderboard />
              <Button
                size="sm"
                width={isSmallScreen ? "190px" : "240px"}
                h={isSmallScreen ? "28px" : undefined}
                onClick={() => navigate("/leaderboard")}
              >
                {tTournament("full-leaderboard")}
              </Button>
            </Flex>
            <Flex w={{ base: "100%", md: "60%" }} minH={0}>
              <Flex flexDirection="column" w="100%" minH={0} gap={2}>
                <Text
                  textTransform="uppercase"
                  textAlign="left"
                  alignSelf="flex-start"
                  zIndex={3}
                  fontFamily="Sonara"
                >
                  {tTournament("your-games")}
                </Text>
                <GamesListBox isTournament width="100%" />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="center" alignItems="flex-start" bgColor={"red"}>
          <Flex
            flexDirection="column"
            alignItems="stretch"
            gap={2}
            width={{ base: "90%", sm: "70%", md: "900px" }}
          >
            <Text
              textTransform="uppercase"
              textAlign="left"
              zIndex={3}
              mb={2}
              fontFamily="Sonara"
            >
              {tTournament("your-entries")}
              {entries > 0 && (
                <Text
                  as="span"
                  fontFamily="Oxanium"
                  ml={2}
                  textTransform="none"
                >
                  ({entries})
                </Text>
              )}
            </Text>
            <Flex justifyContent="center" w="100%">
              <TournamentEntriesBar />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
