import { Divider, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "../../components/Clock";
import { DelayedLoading } from "../../components/DelayedLoading";
import { Leaderboard } from "../../components/Leaderboard";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useTournamentSettings } from "../../queries/useTournamentSettings";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Podium } from "./Podium";
import { SeePrizesSwitcher } from "./SeePrizesSwitcher";

export const NewLeaderboardPage = () => {
  const { tournament } = useTournamentSettings();
  const { t } = useTranslation("home", { keyPrefix: "leaderboard" });
  const { isSmallScreen } = useResponsiveValues();
  const [seePrizes, setSeePrizes] = useState(false);

  return (
    <DelayedLoading ms={200}>
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
          {tournament?.isActive && <Podium seePrizes={seePrizes} />}
          <Leaderboard
            hidePodium={tournament?.isActive}
            lines={100}
            mb={isSmallScreen ? "100px" : "200px"}
            seePrizes={seePrizes}
          />
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
