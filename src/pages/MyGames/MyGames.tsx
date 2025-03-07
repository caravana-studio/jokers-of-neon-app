import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../../components/AudioPlayer.tsx";
import LanguageSwitcher from "../../components/LanguageSwitcher.tsx";
import { Loading } from "../../components/Loading.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { GAME_ID } from "../../constants/localStorage.ts";
import { useUsername } from "../../dojo/utils/useUsername.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGetMyGames } from "../../queries/useGetMyGames.ts";
import { VIOLET } from "../../theme/colors.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { CreatingGameDialog } from "./CreatingGameDialog.tsx";
import { GameBox } from "./GameBox.tsx";

export interface GameSummary {
  id: number;
  level?: number;
  status: string;
  points?: number;
}

const stringTournamentId = import.meta.env.VITE_TOURNAMENT_ID || "1";
const tournamentId = Number(stringTournamentId);

export const MyGames = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  const { data: games, isLoading, error, refetch } = useGetMyGames();

  const navigate = useNavigate();

  const username = useUsername();

  const { isSmallScreen } = useResponsiveValues();

  const [showFinishedGames, setShowFinishedGames] = useState(false);

  const { setGameId, resetLevel, setHand, executeCreateGame } =
    useGameContext();

  const filteredGames = games.filter((game) => {
    return showFinishedGames ? true : game.status !== "FINISHED";
  });

  const [creatingGame, setCreatingGame] = useState(false);

  useEffect(() => {
    setGameId(0);
    localStorage.removeItem(GAME_ID);
    resetLevel();
    setHand([]);
    refetch();
  }, []);

  const handleCreateGame = async () => {
    setCreatingGame(true);
    executeCreateGame();
  };

  return (
    <>
      {true && (
        <CreatingGameDialog
          headingStages={[
            {
              text: t("create-game.stage-1", { tournamentId }),
              showAt: 0,
            },
            {
              text: t("create-game.stage-2", { username }),
              showAt: 2000,
            },
            {
              text: t("create-game.stage-3"),
              showAt: 4000,
            },
            {
              text: t("create-game.stage-4"),
              showAt: 8000,
            },
            {
              text: t("create-game.stage-5"),
              showAt: 9500,
            },
          ]}
        />
      )}
      <MobileDecoration />
      <LanguageSwitcher />
      <AudioPlayer />
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <Heading mb={8} zIndex={2} variant="italic" size={"lg"}>
          {t("title")}
        </Heading>
        <Box
          border="2px solid #DAA1E8FF"
          boxShadow={`0px 0px 20px 15px ${VIOLET}`}
          filter="blur(0.5px)"
          backgroundColor="rgba(0, 0, 0, 1)"
          borderRadius="20px"
          display="grid"
          px={[4, 8]}
          py={isSmallScreen ? 0 : 4}
          width={{ base: "90%", sm: "900px" }}
          height=" 50%"
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
              {filteredGames.map((game) => {
                return <GameBox key={game.id} game={game} />;
              })}
              {filteredGames.length === 0 && !isLoading && (
                <Text size="lg" textAlign="center">
                  {t("no-games")}
                </Text>
              )}
            </Flex>
          </Flex>
        </Box>
        <Flex
          justifyContent="space-between"
          width={{ base: "90%", sm: "600px" }}
          pt={{ base: 10, sm: 14 }}
        >
          <Button
            width="46%"
            onClick={() => {
              navigate("/");
            }}
          >
            {t("go-back")}
          </Button>
          <Button
            disabled={creatingGame}
            onClick={handleCreateGame}
            width="46%"
            variant="secondarySolid"
          >
            {t("start-game")} {creatingGame && <Spinner ml={3} />}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
