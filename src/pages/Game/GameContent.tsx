import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameDeck } from "../../components/GameDeck.tsx";
import { GameMenu } from "../../components/GameMenu.tsx";
import { Loading } from "../../components/Loading.tsx";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGetGame } from "../../queries/useGetGame.ts";
import { HandSection } from "./HandSection.tsx";
import { PreselectedCardsSection } from "./PreselectedCardsSection.tsx";
import { TopSection } from "./TopSection.tsx";

export const GameContent = () => {
  const {
    preSelectedCards,
    gameLoading,
    loadingStates,
    error,
    clearPreSelection,
    executeCreateGame,
    refetchHand,
    addModifier,
    roundRewards,
    gameId,
    checkOrCreateGame,
  } = useGameContext();

  const { data: game } = useGetGame(gameId);
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const navigate = useNavigate();

  useEffect(() => {
    // if roundRewards is true, we don't want to redirect user
    if (!roundRewards) {
      if (game?.state === "FINISHED") {
        navigate("/gameover");
      } else if (game?.state === "AT_SHOP") {
        navigate("/store");
      }
      refetchHand(2);
    }
  }, [game?.state, roundRewards]);

  const handleDragEnd = (event: DragEndEvent) => {
    const modifiedCard = Number(event.over?.id);
    const modifier = Number(event.active?.id);
    if (!isNaN(modifiedCard) && !isNaN(modifier)) {
      const index = preSelectedCards.indexOf(modifiedCard);
      if (index !== -1) {
        addModifier(modifiedCard, modifier);
      }
    }
  };

  useEffect(() => {
    checkOrCreateGame();
  }, []);

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
    return <Loading />;
  }

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <GameMenu />
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
          <Box sx={{ height: "30%", width: "100%" }}>
            <TopSection />
          </Box>
          <DndContext onDragEnd={handleDragEnd} autoScroll={false}>
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
                mr: 20,
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
