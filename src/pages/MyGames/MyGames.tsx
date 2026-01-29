import { Box, Button, Checkbox, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DailyGames } from "../../components/DailyGames/DailyGames.tsx";
import { DelayedLoading } from "../../components/DelayedLoading.tsx";
import { Loading } from "../../components/Loading.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGetMyGames } from "../../queries/useGetMyGames.ts";
import { useTournamentSettings } from "../../queries/useTournamentSettings.ts";
import { useGameStore } from "../../state/useGameStore.ts";
import { VIOLET } from "../../theme/colors.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { logEvent } from "../../utils/analytics.ts";
import { GameBox } from "./GameBox.tsx";
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

  const { data: games, isLoading, error, refetch } = useGetMyGames();
  const { isSmallScreen } = useResponsiveValues();

  const [showFinishedGames, setShowFinishedGames] = useState(false);

  const { tournament } = useTournamentSettings();

  const [surrenderedIds, setSurrenderedIds] = useState<number[]>([]);

  const [isBackDisabled, setIsBackDisabled] = useState(() => {
    return localStorage.getItem("GAME_ID") === null;
  });

  const { resetLevel } = useGameContext();
  const { removeGameId } = useGameStore();

  const filteredGames = games.filter((game) => {
    const notSurrendered = !surrenderedIds.includes(game.id);
    const shouldShow = showFinishedGames
      ? true
      : game.status !== GameStateEnum.GameOver;
    return notSurrendered && shouldShow;
  });

  const handleSurrendered = (gameId: number) => {
    const storedGameId = localStorage.getItem("GAME_ID");

    if (storedGameId && Number(storedGameId) === gameId) {
      localStorage.removeItem("GAME_ID");
      setIsBackDisabled(true);
    }

    setSurrenderedIds((prev) => [...prev, gameId]);
  };

  const showTournament = tournament?.isActive && !tournament?.isFinished;

  useEffect(() => {
    refetch();
    resetLevel();
    removeGameId();
  }, []);

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
          <Heading mb={3} zIndex={2} variant="italic" size={"md"}>
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
          <Box
            border="2px solid #DAA1E8FF"
            boxShadow={`0px 0px 20px 15px ${VIOLET}`}
            backgroundColor="rgba(0, 0, 0, 1)"
            borderRadius="20px"
            display="grid"
            px={[4, 8]}
            py={isSmallScreen ? 0 : 4}
            width={{ base: "90%", sm: "70%", md: "900px" }}
            flexGrow={1}
            minH={0}
            maxHeight="500px"
            overflowY="auto"
          >
            <Flex
              flexDirection={"column"}
              justifyContent="flex-start"
              alignItems="flex-end"
              w="100%"
              gap={4}
              my={4}
            >
              {!isSmallScreen && (
                <Checkbox
                  color="white"
                  checked={showFinishedGames}
                  onChange={(e) => {
                    setShowFinishedGames(e.target.checked);
                  }}
                >
                  {t("show-finished-games").toUpperCase()}
                </Checkbox>
              )}
              <Flex flexDirection="column" gap={3} w="100%">
                {isLoading && <Loading />}
                {filteredGames.map((game) => (
                  <GameBox
                    key={game.id}
                    game={game}
                    onSurrendered={() => handleSurrendered(game.id)}
                  />
                ))}

                {filteredGames.length === 0 && !isLoading && (
                  <Text size="lg" textAlign="center">
                    {t("no-games")}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Box>
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
