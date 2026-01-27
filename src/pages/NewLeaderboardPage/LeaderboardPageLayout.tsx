import { Flex } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "../../components/Clock";
import { DelayedLoading } from "../../components/DelayedLoading";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { Leaderboard } from "../../components/Leaderboard";
import { XpLeaderboard } from "../../components/XpLeaderboard";
import { Tab, TabPattern } from "../../patterns/tabs/TabPattern";
import { useTournamentSettings } from "../../queries/useTournamentSettings";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Podium } from "./Podium";
import { SeePrizesSwitcher } from "./SeePrizesSwitcher";

type LeaderboardPageLayoutProps = {
  entriesSection?: ReactNode;
};

export const LeaderboardPageLayout = ({
  entriesSection,
}: LeaderboardPageLayoutProps) => {
  const { tournament } = useTournamentSettings();
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const [seePrizes, setSeePrizes] = useState(false);
  const isTournamentActive = Boolean(tournament?.isActive);

  const tabs = [
    <Tab key="game" title={t("tabs.game-leaderboard")}>
      <Flex w="100%" h="100%" flexDir="column" alignItems="center">
        <Flex
          flexDir="column"
          w="70%"
          h="100%"
          alignItems={"center"}
        >
          <Flex
            minH={0}
            flexGrow={1}
            flexDir="column"
            w="100%"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Leaderboard
              lines={100}
              mb={isSmallScreen ? "100px" : "200px"}
              isTournamentLeaderboard={false}
            />
          </Flex>
        </Flex>
      </Flex>
    </Tab>,
    ...(isTournamentActive
      ? [
          <Tab key="tournament" title={t("tabs.tournament-leaderboard")}>
            <Flex w="100%" h="100%" flexDir="column" alignItems="center">
              <Flex
                flexDir="column"
                w="70%"
                h="100%"
                alignItems={"center"}
                mt={4}
              >
                <Flex
                  px={isSmallScreen ? 2 : 6}
                  mb={isSmallScreen ? 2 : 4}
                  position="absolute"
                  right={4}
                >
                  <Flex>
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
                {entriesSection}
                <Flex
                  minH={0}
                  flexGrow={1}
                  flexDir={isSmallScreen ? "column" : "row"}
                  w="100%"
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Flex
                    w={isSmallScreen ? "100%" : "50%"}
                    zIndex={10}
                    flexDir={"column"}
                    alignItems={"center"}
                    h={isSmallScreen ? "unset" : "100%"}
                  >
                    <Podium seePrizes={seePrizes} isTournamentLeaderboard />
                  </Flex>
                  <Flex
                    w={isSmallScreen ? "100%" : "50%"}
                    overflowY="auto"
                    h="100%"
                  >
                    <Leaderboard
                      hidePodium
                      lines={100}
                      mb={isSmallScreen ? "100px" : "200px"}
                      seePrizes={seePrizes}
                      isTournamentLeaderboard
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Tab>,
        ]
      : []),
    <Tab key="xp" title={t("tabs.xp-leaderboard")}>
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          flexDir="column"
          w="70%"
          h="100%"
          alignItems={"center"}
        >
          <Flex
            minH={0}
            flexGrow={1}
            flexDir="column"
            w="100%"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <XpLeaderboard lines={100} mb={isSmallScreen ? "100px" : "200px"} />
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
