import { Box, Button, Checkbox, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../../components/AudioPlayer.tsx";
import LanguageSwitcher from "../../components/LanguageSwitcher.tsx";
import { Loading } from "../../components/Loading.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGetMyGames } from "../../queries/useGetMyGames.ts";
import { VIOLET } from "../../theme/colors.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { GameBox } from "./GameBox.tsx";
import { GoBackButton } from "../../components/GoBackButton.tsx";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";

export interface GameSummary {
  id: number;
  level?: number;
  status: string;
  points?: number;
}

export const MyGames = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  const { data: games, isLoading, error, refetch } = useGetMyGames();

  const navigate = useNavigate();

  const { isSmallScreen } = useResponsiveValues();

  const [showFinishedGames, setShowFinishedGames] = useState(false);

  const { prepareNewGame, executeCreateGame } = useGameContext();

  const [surrenderedIds, setSurrenderedIds] = useState<number[]>([]);

  const [isBackDisabled, setIsBackDisabled] = useState(() => {
    return localStorage.getItem("GAME_ID") === null;
  });

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

  useEffect(() => {
    refetch();
  }, []);

  const handleCreateGame = async () => {
    prepareNewGame();
    executeCreateGame();
    navigate("/entering-tournament");
  };

  return (
    <>
      <MobileDecoration />
      <LanguageSwitcher />
      {!isSmallScreen && <AudioPlayer />}
      <Flex
        direction="column"
        justifyContent={isSmallScreen ? "space-between" : "center"}
        alignItems="center"
        height="100%"
        width="100%"
      >
        <Flex
          flexDirection={"column"}
          height={isSmallScreen ? "80%" : "60%"}
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
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
            width={{ base: "90%", sm: "70%", md: "900px" }}
            height="100%"
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

        {isSmallScreen ? (
          <MobileBottomBar
            hideDeckButton
            firstButton={{
              onClick: () => {
                handleCreateGame();
              },
              variant: "secondarySolid",
              label: t("start-game"),
            }}
            secondButtonReactNode={
              <GoBackButton
                visibility={isBackDisabled ? "hidden" : "visible"}
              />
            }
          />
        ) : (
          <Flex
            justifyContent="space-between"
            width={{ base: "90%", sm: "600px" }}
            pt={{ base: 10, sm: 14 }}
          >
            <GoBackButton
              width="46%"
              visibility={isBackDisabled ? "hidden" : "visible"}
            />
            <Button
              onClick={handleCreateGame}
              width="46%"
              variant="secondarySolid"
            >
              {t("start-game")}
            </Button>
          </Flex>
        )}
      </Flex>
    </>
  );
};
