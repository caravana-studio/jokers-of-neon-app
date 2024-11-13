import { Box, Button, Flex, Heading } from "@chakra-ui/react";
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
import { PositionedGameMenu } from "../../components/GameMenu.tsx";
import { Loading } from "../../components/Loading.tsx";
import { MobileCardHighlight } from "../../components/MobileCardHighlight.tsx";
import { ShowPlays } from "../../components/ShowPlays.tsx";
import { SortBy } from "../../components/SortBy.tsx";
import {
  JOYRIDE_LOCALES,
  TUTORIAL_STEPS,
  TUTORIAL_STYLE,
} from "../../constants/gameTutorial";
import {
  HAND_SECTION_ID,
  PRESELECTED_CARD_SECTION_ID,
} from "../../constants/general.ts";
import { useGame } from "../../dojo/queries/useGame.tsx";
import { useCardHighlight } from "../../providers/CardHighlightProvider.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { DiscardButton } from "./DiscardButton.tsx";
import { HandSection } from "./HandSection.tsx";
import { PlayButton } from "./PlayButton.tsx";
import { MobilePreselectedCardsSection } from "./PreselectedCardsSection.mobile.tsx";
import { MobileTopSection } from "./TopSection.mobile.tsx";
import { isTutorial } from "../../utils/isTutorial.ts";
import { useTutorialGameContext } from "../../providers/TutorialGameProvider.tsx";
import { useNavigate } from "react-router-dom";

export const MobileGameContent = () => {
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

  const { highlightedCard } = useCardHighlight();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [cardClicked, setCardClicked] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [autoStep, setAutoStep] = useState(false);
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();

  useEffect(() => {
    setRun(inTutorial);
  }, []);

  const stepData = [
    { step: 13, delay: 2700 },
    { step: 23, delay: 7500 },
  ];

  useEffect(() => {
    const stepInfo = stepData.find((data) => data.step === stepIndex);

    if (stepInfo) {
      const timeout = setTimeout(() => {
        setAutoStep(true);
        setStepIndex(stepIndex + 1);
      }, stepInfo.delay);

      return () => clearTimeout(timeout);
    }
  }, [stepIndex]);

  const handleJoyrideCallbackFactory = (
    setRunCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (data: CallBackProps) => {
      const { type } = data;

      if (
        type === "step:after" &&
        !cardClicked &&
        !buttonClicked &&
        !autoStep
      ) {
        setStepIndex(stepIndex + 1);
      }

      setCardClicked(false);
      setButtonClicked(false);
      setAutoStep(false);

      if (type === "tour:end") {
        setRunCallback(false);
        navigate("/demo");
      }
    };
  };

  const handleJoyrideCallback = handleJoyrideCallbackFactory(setRun);

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

  const game = useGame();

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

  if (gameLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        height: "100%",
      }}
      className="game-tutorial-intro"
    >
      {highlightedCard && <MobileCardHighlight card={highlightedCard} />}

      <Box
        sx={{
          position: "fixed",
          zIndex: 1000,
        }}
        right={[1, 4]}
        bottom={[1, 4]}
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

        <PositionedGameMenu
          showTutorial={() => {
            setRun(true);
          }}
        />
      </Box>

      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <DndContext
          onDragEnd={handleDragEnd}
          autoScroll={false}
          sensors={sensors}
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
            >
              <MobilePreselectedCardsSection />
            </Box>
            <Flex width="90%" mt={2} mx={4} justifyContent={"space-between"}>
              <DiscardButton
                highlight={run}
                onTutorialCardClick={() => {
                  if (run) {
                    setCardClicked(true);
                    setStepIndex(stepIndex + 1);
                  }
                }}
              />
              <PlayButton
                highlight={run}
                onTutorialCardClick={() => {
                  if (run) {
                    setCardClicked(true);
                    setStepIndex(stepIndex + 1);
                  }
                }}
              />
            </Flex>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
              width={"100%"}
            >
              <Box width={"100%"}>
                <Box pb={2} display={"flex"} justifyContent={"center"}>
                  <HandSection />
                </Box>
                <Box
                  width="100%"
                  display={"flex"}
                  alignItems={"center"}
                  backgroundColor="rgba(0,0,0,0.5)"
                  px={18}
                  gap={4}
                >
                  <SortBy />
                  <ShowPlays />
                </Box>
              </Box>
            </Box>
          </Box>
        </DndContext>
      </Box>
    </Box>
  );
};
