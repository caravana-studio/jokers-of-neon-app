import { Divider, Flex, Heading } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "../../components/Clock";
import { DelayedLoading } from "../../components/DelayedLoading";
import { PositionedDiscordLink } from "../../components/DiscordLink";
import { Leaderboard } from "../../components/Leaderboard";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useTournamentSettings } from "../../queries/useTournamentSettings";
import { BLUE } from "../../theme/colors";
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

  return (
    <DelayedLoading ms={200}>
      <PositionedDiscordLink />
      <MobileDecoration fadeToBlack />
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
            <Heading
              zIndex={10}
              variant="italic"
              fontSize={isSmallScreen ? "sm" : "md"}
            >
              {tournament?.isActive
                ? tournament.isFinished
                  ? t("finished")
                  : t("tournament")
                : t("title")}
            </Heading>
            {tournament?.endDate &&
              tournament.isActive &&
              !tournament.isFinished && <Clock date={tournament.endDate} />}
            {tournament?.isActive && (
              <Flex
                position="absolute"
                right={isSmallScreen ? 4 : 5}
                top={isSmallScreen ? "65px" : "130px"}
              >
                <SeePrizesSwitcher onChange={(value) => setSeePrizes(value)} />
              </Flex>
            )}
          </Flex>
          <Divider borderColor={BLUE} mt={3} />
        </Flex>
        <Flex
          flexDir="column"
          w="70%"
          h="100%"
          alignItems={"center"}
          mt={tournament?.isActive ? 4 : 8}
        >
          {entriesSection}
          <Flex
            minH={0}
            flexGrow={1}
            flexDir={isSmallScreen ? "column" : "row"}
            w="100%"
            alignItems={"center"}
            justifyContent={"center"}
          >
            {tournament?.isActive && (
              <Flex
                w={isSmallScreen ? "100%" : "50%"}
                zIndex={10}
                flexDir={"column"}
                alignItems={"center"}
                h={isSmallScreen ? "unset" : "100%"}
              >
                <Podium seePrizes={seePrizes} />
              </Flex>
            )}
            <Flex
              w={isSmallScreen || !tournament?.isActive ? "100%" : "50%"}
              overflowY="auto"
              h="100%"
            >
              <Leaderboard
                hidePodium={tournament?.isActive}
                lines={100}
                mb={isSmallScreen ? "100px" : "200px"}
                seePrizes={seePrizes}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
