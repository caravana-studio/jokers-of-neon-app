import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loading.tsx";
import { SortBy } from "../../components/SortBy.tsx";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGetGame } from "../../queries/useGetGame.ts";
import { HandSection } from "./HandSection.tsx";
import { MobilePreselectedCardsSection } from "./PreselectedCardsSection.mobile.tsx";
import { MobileTopSection } from "./TopSection.mobile.tsx";
import { GameMenu } from "../../components/GameMenu.tsx";

export const MobileGameContent = () => {
  const {
    preSelectedCards,
    gameLoading,
    loadingStates,
    error,
    clearPreSelection,
    executeCreateGame,
    addModifier,
    roundRewards,
    gameId,
    checkOrCreateGame,
    play,
    discard,
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
      <Box
        sx={{
          position: "fixed",
          bottom: "30px",
          right: "15px",
          zIndex: 1000,
          transform: 'scale(0.7)',
        }}
      >
      <GameMenu />
      </Box>
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
        onClick={clearPreSelection}
      >
        <Box sx={{ width: "100%", height: "100%", alignItems: "center", display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ height: "34%", width: "100%" }}>
            <MobileTopSection />
          </Box>
          <DndContext onDragEnd={handleDragEnd} autoScroll={false}>
            <Box
              sx={{
                height: "40%",
                width: "90%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              <MobilePreselectedCardsSection />
            </Box>
            <Flex height="6%" width="90%" mt={2} mx={4} justifyContent={"space-between"}>
              <Button
              size='m'
                onClick={(e) => {
                  e.stopPropagation();
                  play();
                }}
                width="48%"
              >
                play
              </Button>
              <Button
              size='m'
                onClick={(e) => {
                  e.stopPropagation();
                  discard();
                }}
                width="48%"
              >
                discard
              </Button>
            </Flex>
            <Box
              sx={{
                display: "flex",
                height: " 20%",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Box>
                <Box position={"absolute"} bottom={0} zIndex={6} width="140px">
                  <SortBy />
                </Box>
                <Box pb="20px" mx={6} mr={14}>
                  <HandSection />
                </Box>
              </Box>
            </Box>
          </DndContext>
        </Box>
      </Box>
    </Box>
  );
};
