import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameDeck } from "../../components/GameDeck.tsx";
import { GameMenu } from "../../components/GameMenu.tsx";
import { Loading } from "../../components/Loading.tsx";
import { TutorialModal } from "../../components/TutorialModal.tsx";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGetGame } from "../../queries/useGetGame.ts";
import { HandSection } from "./HandSection.tsx";
import { PreselectedCardsSection } from "./PreselectedCardsSection.tsx";
import { TopSection } from "./TopSection.tsx";
import { SKIP_TUTORIAL } from "../../constants/localStorage.ts";

export const GameContent = () => {
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
  } = useGameContext();

  const [showTutorial, setShowTutorial] = useState(!window.localStorage.getItem(SKIP_TUTORIAL))

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
          height: "100%",
          width: "100%",
        }}
      >

        {showTutorial && <TutorialModal onClose={() => {setShowTutorial(false)}} />}

        <Box sx={{ width: "100%", height: "100%" }} px={8} py={2}>
          <Image src='/borders/top.png' height="8%" width="100%" object-fit/>
          <Box sx={{ height: "24.7%", width: "100%"}}>
            <TopSection />
          </Box>
          <DndContext onDragEnd={handleDragEnd} autoScroll={false}>
            <Box
              sx={{
                height: "34.7%",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <PreselectedCardsSection />
            </Box>
            <Box
              pb={{ base: 2, md: "7vh" }}
              mr={{ base: 10, md: 20 }}
              sx={{
                display: "flex",
                height: "24.7%",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <HandSection />
            </Box>
          </DndContext>
          <Image src='/borders/bottom.png'  height="8%" width="100%" object-fit/>
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: 7,
            left: 10,
            zIndex: 1000,
          }}
        >
          <GameMenu />
        </Box>
        <Box
          sx={{
            position: "fixed",
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
