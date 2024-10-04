import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps } from 'react-joyride';
import { GameMenu } from "../../components/GameMenu.tsx";
import { Loading } from "../../components/Loading.tsx";
import { SortBy } from "../../components/SortBy.tsx";
import { GAME_TUTORIAL_STEPS, MODIFIERS_TUTORIAL_STEPS, SPECIAL_CARDS_TUTORIAL_STEPS, TUTORIAL_STYLE } from "../../constants/gameTutorial";
import { SKIP_TUTORIAL_GAME, SKIP_TUTORIAL_MODIFIERS, SKIP_TUTORIAL_SPECIAL_CARDS } from "../../constants/localStorage.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { DiscardButton } from "./DiscardButton.tsx";
import { HandSection } from "./HandSection.tsx";
import { PlayButton } from "./PlayButton.tsx";
import { MobilePreselectedCardsSection } from "./PreselectedCardsSection.mobile.tsx";
import { MobileTopSection } from "./TopSection.mobile.tsx";
import { ShowPlays } from "../../components/ShowPlays.tsx";

export const MobileGameContent = () => {
  const {
    hand,
    preSelectedCards,
    gameLoading,
    error,
    clearPreSelection,
    executeCreateGame,
    addModifier,
    roundRewards,
    discardEffectCard,
    discardSpecialCard,
  } = useGameContext();

  const [isItemDragged, setIsItemDragged] = useState<boolean>(false);
  const [run, setRun] = useState(false);
  const[runSpecial, setRunSpecial] = useState(false);
  const [runTutorialModifiers, setRunTutorialModifiers] = useState(false);
  const [specialTutorialCompleted, setSpecialTutorialCompleted] = useState(false);

  useEffect(() => {
    const showTutorial = !localStorage.getItem(SKIP_TUTORIAL_GAME);
    if (showTutorial)
      setRun(true);
  }, []);

  const handleJoyrideCallbackFactory = (storageKey: string, setRunCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (data: CallBackProps) => {
      const { type } = data;
  
      if (type === "tour:end") {
        window.localStorage.setItem(storageKey, "true");
        setRunCallback(false);
        if (storageKey === SKIP_TUTORIAL_SPECIAL_CARDS) {
          setSpecialTutorialCompleted(true);
        }
      }
    };
  };

  const handleJoyrideCallback = handleJoyrideCallbackFactory(SKIP_TUTORIAL_GAME, setRun);
  const handleSpecialJoyrideCallback = handleJoyrideCallbackFactory(SKIP_TUTORIAL_SPECIAL_CARDS, setRunSpecial);
  const handleModifiersJoyrideCallback = handleJoyrideCallbackFactory(SKIP_TUTORIAL_MODIFIERS, setRunTutorialModifiers);

  const handleDragEnd = (event: DragEndEvent) => {
    setIsItemDragged(false);
    const modifiedCard = Number(event.over?.id);

    // TODO: Improve this
    let isSpecial = false;
    let draggedCardId;
    const activeId = String(event.active?.id);

    if (activeId.startsWith("s")) {
      draggedCardId = Number(activeId.slice(1));
      isSpecial = true;
    } else {
      draggedCardId = Number(activeId);
    }

    if (!isNaN(modifiedCard) && !isNaN(draggedCardId)) {
      const index = preSelectedCards.indexOf(modifiedCard);
      if (index !== -1) {
        addModifier(modifiedCard, draggedCardId);
      }
    }
    if (isSpecial && event.over?.id === "play-discard") {
      discardSpecialCard(draggedCardId);
    } else if (event.over?.id === "play-discard") {
      discardEffectCard(draggedCardId);
    }
  };

  const game = useGame();

  useEffect(() => {
    const showSpecialCardTutorial = !localStorage.getItem(SKIP_TUTORIAL_SPECIAL_CARDS);
    const showModifiersTutorial = !localStorage.getItem(SKIP_TUTORIAL_MODIFIERS);

    if (showSpecialCardTutorial && game?.len_current_special_cards != undefined && game?.len_current_special_cards > 0) {
      setRunSpecial(true);
    } else if (specialTutorialCompleted || !showSpecialCardTutorial) {
      if (showModifiersTutorial) {
        const hasModifier = hand.some((card) => card.isModifier);
        if (hasModifier) {
          setRunTutorialModifiers(true);
        }
      }
    }
  }, [game, hand, specialTutorialCompleted]);

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

  if (gameLoading) {
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
          zIndex: 1000,
          transform: ["scale(0.7)", "scale(1.2)"],
        }}
        right={[1,4]}
        bottom={[1,4]}
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

        <Joyride 
          steps={SPECIAL_CARDS_TUTORIAL_STEPS}
          run={runSpecial} 
          continuous 
          showSkipButton 
          showProgress 
          callback={handleSpecialJoyrideCallback}
          styles={TUTORIAL_STYLE}
        />

        <Joyride 
          steps={MODIFIERS_TUTORIAL_STEPS}
          run={runTutorialModifiers} 
          continuous 
          showSkipButton 
          showProgress 
          callback={handleModifiersJoyrideCallback}
          styles={TUTORIAL_STYLE}
        />

        <GameMenu showTutorial={() => { setRun(true);}} />
      </Box>
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={() => {
            setIsItemDragged(true);
          }}
          autoScroll={false}
        >
          <Box
            paddingTop={4}
            sx={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ height: "205px", width: "100%" }}>
              <MobileTopSection />
            </Box>
            <Box
              sx={{
                width: "90%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
              transform={["scale(1)", "scale(1.5)"]}
            >
              <MobilePreselectedCardsSection />
            </Box>
            <Flex width="90%" mt={2} mx={4} justifyContent={"space-between"}>
              <DiscardButton itemDragged={isItemDragged} highlight={run}/>
              <PlayButton highlight={run}/>
            </Flex>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Box>
                <Box position={"absolute"} left={3} bottom={0} zIndex={6} width="190px" display={"flex"} alignItems={"center"} backgroundColor='rgba(0,0,0,0.5)'>
                  <SortBy />
                  <ShowPlays/>
                </Box>
                <Box pb={[10, 20]} transform={["scale(1)", "scale(1.5)"]}>
                  <HandSection />
                </Box>
              </Box>
            </Box>
          </Box>
        </DndContext>
      </Box>
    </Box>
  );
};
