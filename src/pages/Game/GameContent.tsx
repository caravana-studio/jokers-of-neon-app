import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameDeck } from "../../components/GameDeck.tsx";
import { GameMenu } from "../../components/GameMenu.tsx";
import { Loading } from "../../components/Loading.tsx";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { HandSection } from "./HandSection.tsx";
import { PreselectedCardsSection } from "./PreselectedCardsSection.tsx";
import { TopSection } from "./TopSection.tsx";
import { SKIP_TUTORIAL_GAME } from "../../constants/localStorage.ts";
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import {GAME_TUTORIAL_STEPS, TUTORIAL_STYLE} from "../../constants/gameTutorial";

export const GameContent = () => {
  const {
    preSelectedCards,
    gameLoading,
    error,
    executeCreateGame,
    addModifier,
    roundRewards,
    gameId,
    checkOrCreateGame,
    lockRedirection,
  } = useGameContext();

  const [run, setRun] = useState(false);

  useEffect(() => {
    const showTutorial = !localStorage.getItem(SKIP_TUTORIAL_GAME);
    if (showTutorial)
      setRun(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { type } = data;

    if (type === "tour:end"){
      window.localStorage.setItem(SKIP_TUTORIAL_GAME, "true");
      setRun(false);
    }
  };

  const game = useGame();

  const navigate = useNavigate();

  useEffect(() => {
    // if roundRewards is true, we don't want to redirect user
    if (!roundRewards && !lockRedirection) {
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

  if (gameLoading || !game) {
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
        <Joyride 
          steps={GAME_TUTORIAL_STEPS}
          run={run} 
          continuous 
          showSkipButton 
          showProgress 
          callback={handleJoyrideCallback}
          styles={TUTORIAL_STYLE}
        />

        <Box sx={{ width: "100%", height: "100%" }}>
          <Image
            src="/borders/top.png"
            height="8%"
            width="100%"
            maxHeight="70px"
            position="fixed"
            top={0}
          />
          <Box
            sx={{ height: "100%", width: "100%" }}
            pt={"90px"}
            pb={"120px"}
            px={20}
          >
            <Box sx={{ height: "20%", width: "100%" }}>
              <TopSection />
            </Box>
            <DndContext onDragEnd={handleDragEnd} autoScroll={false}>
              <Box
                sx={{
                  height: "60%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                pt={12}
              >
                <PreselectedCardsSection />
              </Box>
              <Box
                pb={{ base: 2, md: "2vh" }}
                mr={{ base: 10, md: 20 }}
                sx={{
                  display: "flex",
                  height: "30%",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <HandSection />
              </Box>
            </DndContext>
          </Box>
          <Image
            src="/borders/bottom.png"
            maxHeight="70px"
            height="8%"
            width="100%"
            position="fixed"
            bottom={0}
            sx={{ pointerEvents: "none" }}
          />
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: 14,
            left: 20,
            zIndex: 1000,
          }}
        >
          <GameMenu showTutorial={() => { setRun(true);}} />
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: 14,
            right: 20,
          }}
        >
          <GameDeck />
        </Box>
      </Box>
    </Box>
  );
};

