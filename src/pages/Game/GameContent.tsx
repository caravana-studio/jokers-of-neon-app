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
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { PositionedGameDeck } from "../../components/PositionedGameDeck.tsx";
import {
  JOYRIDE_LOCALES,
  TUTORIAL_STEPS,
  TUTORIAL_STYLE,
} from "../../constants/gameTutorial";
import {
  HAND_SECTION_ID,
  PRESELECTED_CARD_SECTION_ID,
} from "../../constants/general.ts";
import { GameStateEnum } from "../../dojo/typescript/custom.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useCurrentHandStore } from "../../state/useCurrentHandStore.ts";
import { useGameStore } from "../../state/useGameStore.ts";
import { isTutorial } from "../../utils/isTutorial.ts";
import { HandSection } from "./HandSection.tsx";
import { PreselectedCardsSection } from "./PreselectedCardsSection.tsx";
import { TopSection } from "./TopSection.tsx";
import { logEvent } from "../../utils/analytics.ts";

export const GameContent = () => {
  const inTutorial = isTutorial();
  const { executeCreateGame, resetLevel, stepIndex, setStepIndex } =
    useGameContext();

  const {
    isRageRound,
    state,
    gameLoading,
    gameError: error,
    id: gameId,
  } = useGameStore();
  const {
    preSelectCard,
    unPreSelectCard,
    preSelectedCards,
    hand,
    addModifier,
  } = useCurrentHandStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [run, setRun] = useState(false);
  const [cardClicked, setCardClicked] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [autoStep, setAutoStep] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);
  const [highlighted, setHighlighted] = useState(false);
  const [canClickPowerUp, setCanClickPowerUp] = useState(false);

  useEffect(() => {
    setRun(inTutorial);
  }, []);

  const stepData = [
    { step: 13, delay: 2700 },
    { step: 22, delay: 4200 },
    { step: 32, delay: 7500 },
  ];

  const btnHighlight = [
    { step: 4 },
    { step: 7 },
    { step: 12 },
    { step: 21 },
    { step: 31 },
  ];

  const powerUpClick = [{ step: 19 }, { step: 20 }];

  useEffect(() => {
    const stepInfo = stepData.find((data) => data.step === stepIndex);

    if (stepInfo) {
      const timeout = setTimeout(() => {
        setAutoStep(true);
        setStepIndex?.((stepIndex ?? 0) + 1);
      }, stepInfo.delay);

      return () => clearTimeout(timeout);
    }
  }, [stepIndex]);

  const handleJoyrideCallbackFactory = (
    setRunCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (data: CallBackProps) => {
      const { type, status } = data;

      if (
        type === "step:after" &&
        !cardClicked &&
        !buttonClicked &&
        !autoStep
      ) {
        setStepIndex?.(stepIndex ?? 0 + 1);
      }

      setCardClicked(false);
      setButtonClicked(false);
      setAutoStep(false);

      const stepInfo = btnHighlight.find((data) => data.step === stepIndex);
      if (stepInfo) {
        setHighlighted(true);
      } else {
        setHighlighted(false);
      }

      const powerUpStep = powerUpClick.find((data) => data.step === stepIndex);
      if (powerUpStep) {
        setCanClickPowerUp(true);
      } else {
        setCanClickPowerUp(false);
      }

      if (type === "tour:end") {
        logEvent(status === "skipped" ? "tutorial_skipped" : "tutorial_finished");
        logEvent('tutorial_done')
        setRunCallback(false);
        switch (state) {
          case GameStateEnum.Store:
            return navigate("/store");
          case GameStateEnum.Map:
            return navigate("/map");
          default: {
            resetLevel();
            if (!gameId || gameId === 0) return navigate("/my-games");
            else return navigate("/demo");
          }
        }
      }
    };
  };

  const handleJoyrideCallback = handleJoyrideCallbackFactory(setRun);

  const handleDragEnd = (event: DragEndEvent) => {
    const draggedCard = Number(event.active?.id);
    const modifiedCardId = Number(event.over?.id);
    const isModifier = hand.find((c) => c.idx === draggedCard)?.isModifier;

    if (!isNaN(modifiedCardId) && !isNaN(draggedCard) && isModifier) {
      const index = preSelectedCards.indexOf(modifiedCardId);
      if (index !== -1) {
        addModifier(modifiedCardId, draggedCard);
      }
    } else if (
      !isModifier &&
      (event.over?.id === PRESELECTED_CARD_SECTION_ID || !isNaN(modifiedCardId))
    ) {
      setCardClicked(true);
      setStepIndex?.((stepIndex ?? 0) + 1);
      preSelectCard(draggedCard);
    } else if (event.over?.id === HAND_SECTION_ID) {
      unPreSelectCard(draggedCard);
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
        <Heading size="xl" zIndex={1} variant="neonGreen">
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

  if (gameLoading || !isTutorial) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
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
          showProgress={false}
          callback={handleJoyrideCallback}
          styles={TUTORIAL_STYLE}
          locale={JOYRIDE_LOCALES}
          stepIndex={stepIndex}
          disableCloseOnEsc
          disableOverlayClose
          showSkipButton
          hideCloseButton
        />

        <Box
          sx={{ width: "100%", height: "100%" }}
          className="game-tutorial-intro"
        >
          <CachedImage
            src={`/borders/top${isRageRound ? "-rage" : ""}.png`}
            height="8%"
            width="calc(100% - 48px)"
            maxHeight="70px"
            position="fixed"
            top={0}
            zIndex={0}
          />
          <Box sx={{ height: "100%", width: "100%" }} px={"40px"}>
            <Box sx={{ height: "30%", width: "100%" }} pt={"60px"}>
              <TopSection
                onTutorialCardClick={() => {
                  if (run) {
                    setButtonClicked(true);
                    setStepIndex?.((stepIndex ?? 0) + 1);
                  }
                }}
              />
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
                    inTutorial={run}
                    highlightBtns={highlighted}
                    onTutorialCardClick={() => {
                      if (run) {
                        setButtonClicked(true);
                        setStepIndex?.((stepIndex ?? 0) + 1);
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
                        setStepIndex?.((stepIndex ?? 0) + 1);
                      }
                    }}
                  />
                </Box>
              </DndContext>
            </Box>
          </Box>
          <CachedImage
            src={`/borders/bottom${isRageRound ? "-rage" : ""}.png`}
            maxHeight="70px"
            height="8%"
            width="calc(100% - 48px)"
            position="fixed"
            bottom={0}
            sx={{ pointerEvents: "none" }}
          />
        </Box>

        <PositionedGameDeck />
      </Box>
    </Box>
  );
};
