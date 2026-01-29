import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DailyGames } from "../../components/DailyGames/DailyGames.tsx";
import { DelayedLoading } from "../../components/DelayedLoading.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { useGetMyGames } from "../../queries/useGetMyGames.ts";
import { useTournamentSettings } from "../../queries/useTournamentSettings.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { logEvent } from "../../utils/analytics.ts";
import { GamesListBox } from "./GamesListBox.tsx";
import { TournamentEntriesBar } from "./TournamentEntriesBar.tsx";

export interface GameSummary {
  id: number;
  level?: number;
  status: string;
  points?: number;
  currentNodeId?: number;
  round?: number;
  isTournament?: boolean;
}

export const MyGames = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  useEffect(() => {
    logEvent("open_my_games_page");
  }, []);

  const { isLoading } = useGetMyGames();
  const { isSmallScreen } = useResponsiveValues();

  const { tournament } = useTournamentSettings();

  const showTournament = tournament?.isActive && !tournament?.isFinished;

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
        pt={[8, 16]}
        pb={[0, 4]}
      >
        <Flex
          flexDirection={"column"}
          height={
            isSmallScreen
              ? showTournament
                ? "70%"
                : "75%"
              : showTournament
                ? "60%"
                : "70%"
          }
          // bgColor="red"
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Heading
            mb={3}
            zIndex={2}
            variant="italic"
            size={isSmallScreen ? "sm" : "md"}
          >
            {t("title")}
          </Heading>
          <Flex
            px={[2, 4]}
            py={isSmallScreen ? 0 : 4}
            width={{ base: "90%", sm: "70%", md: "900px" }}
            justifyContent={isSmallScreen ? "space-between" : "center"}
            gap={8}
            alignItems={"center"}
            zIndex={2}
            mb={5}
          >
            <Text fontSize={isSmallScreen ? 12 : 20}>{t("learn")}</Text>
            <Button
              size={"sm"}
              width={isSmallScreen ? "90px" : "110px"}
              h={isSmallScreen ? "25px" : undefined}
              onClick={() => navigate("/tutorial")}
              disabled={isLoading}
            >
              {t("tuto")}
            </Button>
          </Flex>
          <GamesListBox isTournament={false} />
        </Flex>
        <Flex
          w="100%"
          // bgColor="blue"
          h={
            isSmallScreen
              ? showTournament
                ? "30%"
                : "25%"
              : showTournament
                ? "40%"
                : "30%"
          }
          justifyContent={"center"}
          alignItems={"center"}
          pb={4}
        >
          <Flex
            w="100%"
            flexDirection="column"
            alignItems="center"
            gap={isSmallScreen ? 4 : 6}
          >
            {showTournament && <TournamentEntriesBar />}
            <DailyGames />
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
