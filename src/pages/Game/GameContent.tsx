import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Joyride, { CallBackProps } from "react-joyride";
import { GameDeck } from "../../components/GameDeck.tsx";
import { PositionedGameMenu } from "../../components/GameMenu.tsx";
import { Loading } from "../../components/Loading.tsx";
import {
  GAME_TUTORIAL_STEPS,
  JOYRIDE_LOCALES,
  MODIFIERS_TUTORIAL_STEPS,
  SPECIAL_CARDS_TUTORIAL_STEPS,
  TUTORIAL_STEPS,
  TUTORIAL_STYLE,
} from "../../constants/gameTutorial";
import {
  HAND_SECTION_ID,
  PRESELECTED_CARD_SECTION_ID,
} from "../../constants/general.ts";
import {
  SKIP_TUTORIAL_GAME,
  SKIP_TUTORIAL_MODIFIERS,
  SKIP_TUTORIAL_SPECIAL_CARDS,
} from "../../constants/localStorage.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { HandSection } from "./HandSection.tsx";
import { PreselectedCardsSection } from "./PreselectedCardsSection.tsx";
import { TopSection } from "./TopSection.tsx";
import { useTutorialGameContext } from "../../providers/TutorialGameProvider.tsx";
import { isTutorial } from "../../utils/isTutorial.ts";

export const GameContent = () => {
  const inTutorial = isTutorial();
  const {
    hand,
    preSelectedCards,
    gameLoading,
    error,
    executeCreateGame,
    addModifier,
    preSelectCard,
    unPreSelectCard,
  } = !inTutorial ? useGameContext() : useTutorialGameContext();
  const { isRageRound } = !inTutorial
    ? useGameContext()
    : useTutorialGameContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [runSpecial, setRunSpecial] = useState(false);
  const [cardClicked, setCardClicked] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [runTutorialModifiers, setRunTutorialModifiers] = useState(false);
  const [specialTutorialCompleted, setSpecialTutorialCompleted] =
    useState(false);

  const { t } = useTranslation(["game"]);

  useEffect(() => {
    // const showTutorial = !localStorage.getItem(SKIP_TUTORIAL_GAME);
    // if (showTutorial) setRun(true);
    setRun(inTutorial);
  }, []);

  const handleJoyrideCallbackFactory = (
    storageKey: string,
    setRunCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (data: CallBackProps) => {
      const { type } = data;

      if (type === "step:after" && !cardClicked && !buttonClicked) {
        setStepIndex(stepIndex + 1);
      }

      setCardClicked(false);
      setButtonClicked(false);

      if (type === "tour:end") {
        window.localStorage.setItem(storageKey, "true");
        setRunCallback(false);
        if (storageKey === SKIP_TUTORIAL_SPECIAL_CARDS) {
          setSpecialTutorialCompleted(true);
        }
      }
    };
  };

  const handleJoyrideCallback = handleJoyrideCallbackFactory(
    SKIP_TUTORIAL_GAME,
    setRun
  );
  // const handleSpecialJoyrideCallback = handleJoyrideCallbackFactory(
  //   SKIP_TUTORIAL_SPECIAL_CARDS,
  //   setRunSpecial
  // );
  // const handleModifiersJoyrideCallback = handleJoyrideCallbackFactory(
  //   SKIP_TUTORIAL_MODIFIERS,
  //   setRunTutorialModifiers
  // );

  const game = useGame();

  const handleDragEnd = (event: DragEndEvent) => {
    const draggedCard = Number(event.active?.id);
    const isModifier = hand.find((c) => c.idx === draggedCard)?.isModifier;

    const modifiedCard = Number(event.over?.id);
    if (!isNaN(modifiedCard) && !isNaN(draggedCard) && isModifier) {
      const index = preSelectedCards.indexOf(modifiedCard);
      if (index !== -1) {
        addModifier(modifiedCard, draggedCard);
      }
    } else if (
      !isModifier &&
      (event.over?.id === PRESELECTED_CARD_SECTION_ID || !isNaN(modifiedCard))
    ) {
      setCardClicked(true);
      setStepIndex(stepIndex + 1);
      preSelectCard(draggedCard);
    } else if (event.over?.id === HAND_SECTION_ID) {
      unPreSelectCard(draggedCard);
    }
  };

  useEffect(() => {
    const showSpecialCardTutorial = !localStorage.getItem(
      SKIP_TUTORIAL_SPECIAL_CARDS
    );
    const showModifiersTutorial = !localStorage.getItem(
      SKIP_TUTORIAL_MODIFIERS
    );

    if (
      showSpecialCardTutorial &&
      game?.len_current_special_cards != undefined &&
      game?.len_current_special_cards > 0
    ) {
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
          {t("error.labels.error-msj")}
        </Heading>
        <Button
          variant="outline"
          sx={{ width: 300 }}
          onClick={(e) => {
            e.stopPropagation();
            executeCreateGame();
          }}
        >
          {t("error.labels.label-error-btn")}
        </Button>
      </Flex>
    );
  }

  if (gameLoading || (!game && !isTutorial)) {
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
          steps={TUTORIAL_STEPS}
          run={run}
          continuous
          showProgress
          callback={handleJoyrideCallback}
          styles={TUTORIAL_STYLE}
          locale={JOYRIDE_LOCALES}
          stepIndex={stepIndex}
          disableCloseOnEsc
          disableOverlayClose
          showSkipButton={false}
          hideCloseButton
        />

        {/* <Joyride
          steps={SPECIAL_CARDS_TUTORIAL_STEPS}
          run={runSpecial}
          continuous
          showSkipButton
          showProgress
          callback={handleSpecialJoyrideCallback}
          styles={TUTORIAL_STYLE}
          locale={JOYRIDE_LOCALES}
        />

        <Joyride
          steps={MODIFIERS_TUTORIAL_STEPS}
          run={runTutorialModifiers}
          continuous
          showSkipButton
          showProgress
          callback={handleModifiersJoyrideCallback}
          styles={TUTORIAL_STYLE}
          locale={JOYRIDE_LOCALES}
        /> */}

        <Box
          sx={{ width: "100%", height: "100%" }}
          className="game-tutorial-intro"
        >
          <Image
            src={`/borders/top${isRageRound ? "-rage" : ""}.png`}
            height="8%"
            width="100%"
            maxHeight="70px"
            position="fixed"
            top={0}
            zIndex={0}
          />
          <Box sx={{ height: "100%", width: "100%" }} px={"70px"}>
            <Box sx={{ height: "30%", width: "100%" }} pt={"60px"}>
              <TopSection />
            </Box>
            <Box height={"70%"} width={"100%"}>
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                autoScroll={false}
              >
                <Box
                  sx={{
                    height: "55%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <PreselectedCardsSection
                    isTutorialRunning={run}
                    onTutorialCardClick={() => {
                      if (run) {
                        setButtonClicked(true);
                        setStepIndex(stepIndex + 1);
                      }
                    }}
                  />
                </Box>
                <Box
                  pb={"60px"}
                  mr={{ base: 10, md: 20 }}
                  sx={{
                    display: "flex",
                    height: "45%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <HandSection
                    onTutorialCardClick={() => {
                      if (run) {
                        setCardClicked(true);
                        setStepIndex(stepIndex + 1);
                      }
                    }}
                  />
                </Box>
              </DndContext>
            </Box>
          </Box>
          <Image
            src={`/borders/bottom${isRageRound ? "-rage" : ""}.png`}
            maxHeight="70px"
            height="8%"
            width="100%"
            position="fixed"
            bottom={0}
            sx={{ pointerEvents: "none" }}
          />
        </Box>

        <PositionedGameMenu
          decoratedPage
          bottomPositionDesktop={16}
          showTutorial={() => {
            setRun(true);
          }}
        />
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
