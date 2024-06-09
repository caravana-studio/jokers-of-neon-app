import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  useTheme,
} from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../../components/AudioPlayer.tsx";
import { GameDeck } from "../../components/GameDeck.tsx";
import { useGame } from "../../dojo/utils/useGame.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { HandSection } from "./HandSection.tsx";
import { PreselectedCardsSection } from "./PreselectedCardsSection.tsx";
import { TopSection } from "./TopSection.tsx";

export const GameContent = () => {
  const {
    preSelectedCards,
    getModifiers,
    setPreSelectedCards,
    gameLoading,
    loadingStates,
    error,
    clearPreSelection,
    executeCreateGame,
    refetchHand,
  } = useGameContext();
  const { colors } = useTheme();

  const game = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (game?.state === "FINISHED") {
      navigate("/gameover");
    } else if (game?.state === "AT_SHOP") {
      navigate("/store");
    }
    refetchHand(2);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const modifiedCard = Number(event.over?.id);
    const modifier = Number(event.active?.id);
    if (!isNaN(modifiedCard) && !isNaN(modifier)) {
      const index = preSelectedCards.indexOf(modifiedCard);
      if (index !== -1) {
        const modifiers = getModifiers(index);
        if (modifiers.length < 2) {
          const updatedPreselectedCards = [...preSelectedCards];
          updatedPreselectedCards.splice(
            index + 1 + modifiers.length,
            0,
            modifier
          );
          setPreSelectedCards(updatedPreselectedCards);
        }
      }
    }
  };

  if (error) {
    return (
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={8}
        sx={{ height: "100%" }}
      >
        <Heading size="xl" variant="neonGreen">
          error creating game
        </Heading>
        <Button
          variant="outline"
          sx={{ width: 300 }}
          onClick={(e) => {
            e.stopPropagation();
            executeCreateGame();
          }}
        >
          CREATE NEW GAME
        </Button>
      </Flex>
    );
  }

  if (gameLoading || loadingStates) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading
          variant="neonGreen"
          sx={{
            m: 10,
            fontSize: 60,
            textShadow: `0 0 20px ${colors.neonGreen}`,
          }}
        >
          <Spinner size="xl" />
        </Heading>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <AudioPlayer />
      <Box
        sx={{
          height: "100%",
          width: "100%",
          filter: "blur(0.7px)",
          animation: "jerkup-mild 100ms infinite",
        }}
        onClick={clearPreSelection}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <Box sx={{ height: "30%", p: 10, width: "100%" }}>
            <TopSection />
          </Box>
          <DndContext onDragEnd={handleDragEnd}>
            <Box
              sx={{
                height: "40%",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              <PreselectedCardsSection />
            </Box>
            <Box
              sx={{
                display: "flex",
                height: " 30%",
                alignItems: "flex-end",
                justifyContent: "center",
                mx: 4,
                pb: 10,
              }}
            >
              <HandSection />
            </Box>
          </DndContext>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 7,
            right: 10,
          }}
        >
          <GameDeck />
        </Box>
      </Box>
    </Box>
  );
};
