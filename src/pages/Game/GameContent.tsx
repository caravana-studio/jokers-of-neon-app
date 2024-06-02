import { Box, Heading, Spinner, useTheme } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import AudioPlayer from "../../components/AudioPlayer.tsx";
import { GameDeck } from "../../components/GameDeck.tsx";
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
  } = useGameContext();
  const { colors } = useTheme();

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
  if (error) {
    return <Heading sx={{ m: 10, fontSize: 30 }}>Error creating game</Heading>;
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
        <GameDeck />
      </Box>
    </Box>
  );
};
