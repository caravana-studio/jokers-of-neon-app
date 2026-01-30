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
        py={[8, "80px"]}
        px={{ base: 4, sm: "100px" }}
        gap={{ base: 5, sm: 8 }}
      >
        <Flex
          width={{ base: "100%" }}
          alignItems="center"
          justifyContent="space-between"
          zIndex={2}
        >
          <Heading variant="italic" size={isSmallScreen ? "sm" : "md"}>
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
          flexDirection={{ base: "column", sm: "row" }}
          width="100%"
          minH={0}
          flexGrow={1}
          gap={{ base: 4, sm: 8 }}
        >
          <Flex
            flexDirection="column"
            // height={isSmallScreen ? "75%" : "60%"}
            width={{ base: "100%", sm: "40%" }}
            justifyContent="center"
            alignItems="center"
          >
            <Flex
              width={{ base: "100%"}}
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
              justifyContent="center"
              gap={isSmallScreen ? 4 : 8}
              zIndex={2}
              flexGrow={1}
              minH={0}
              mt={-10}
            >
              <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                w={{ base: "100%" }}
                gap={{ base: 2, sm: 4 }}
              >
                <Podium isTournamentLeaderboard />
                <Button
                  size="sm"
                  width={isSmallScreen ? "220px" : "400px"}
                  h={isSmallScreen ? "28px" : undefined}
                  onClick={() => navigate("/leaderboard")}
                >
                  {tTournament("full-leaderboard")}
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex w={{ base: "100%", sm: "60%" }} flexGrow={1} minH={0}>
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

        <Flex w="100%" justifyContent="center" alignItems="flex-start">
          <Flex
            flexDirection="column"
            alignItems="stretch"
            gap={2}
            width={{ base: "100%" }}
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
