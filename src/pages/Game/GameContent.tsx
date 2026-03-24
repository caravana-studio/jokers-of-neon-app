import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { useCardAnimations } from "../../providers/CardAnimationsProvider.tsx";
import { useCurrentHandStore } from "../../state/useCurrentHandStore.ts";
import { useGameStore } from "../../state/useGameStore.ts";
import { isTutorial } from "../../utils/isTutorial.ts";
import { HandSection } from "./HandSection.tsx";
import { PreselectedCardsSection } from "./PreselectedCardsSection.tsx";
import { SharedPlayableCardsLayer } from "./SharedPlayableCardsLayer.tsx";
import { TopSection } from "./TopSection.tsx";
import { logEvent } from "../../utils/analytics.ts";

type CardDropOrigin = {
  left: number;
  top: number;
  token: number;
};

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
  const { animatedCard } = useCardAnimations();

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
  const cardsStageRef = useRef<HTMLDivElement>(null);
  const handCardsAnchorRef = useRef<HTMLDivElement>(null);
  const preselectedCardsAnchorRef = useRef<HTMLDivElement>(null);
  const deckAnchorRef = useRef<HTMLDivElement>(null);
  const dropOriginTokenRef = useRef(0);
  const [dragDropOrigins, setDragDropOrigins] = useState<
    Record<number, CardDropOrigin>
  >({});

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

  const registerCardDropOrigin = (event: DragEndEvent, cardIdx: number) => {
    const stageRect = cardsStageRef.current?.getBoundingClientRect();
    const translatedRect = event.active.rect.current.translated;
    const fallbackRect = event.active.rect.current.initial;
    const activeRect = translatedRect ?? fallbackRect;

    if (!stageRect || !activeRect) return;

    const nextToken = ++dropOriginTokenRef.current;
    setDragDropOrigins((currentOrigins) => ({
      ...currentOrigins,
      [cardIdx]: {
        left: activeRect.left - stageRect.left,
        top: activeRect.top - stageRect.top,
        token: nextToken,
      },
    }));
  };

  const resolveDropZone = (event: DragEndEvent) => {
    const overId = event.over?.id;
    if (overId === PRESELECTED_CARD_SECTION_ID) return "preselected";
    if (overId === HAND_SECTION_ID) return "hand";

    const targetCard = hand.find((card) => card.id === String(overId));
    if (!targetCard) return null;
    return preSelectedCards.includes(targetCard.idx) ? "preselected" : "hand";
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const draggedCard = Number(event.active?.id);
    const overId = event.over?.id;
    const targetCard = hand.find((card) => card.id === String(overId));
    const numericOverId = Number(overId);
    const modifiedCardId =
      targetCard?.idx ?? (Number.isNaN(numericOverId) ? NaN : numericOverId);
    const isModifier = hand.find((c) => c.idx === draggedCard)?.isModifier;
    const isCurrentlyPreselected = preSelectedCards.includes(draggedCard);
    const dropZone = resolveDropZone(event);

    if (!isNaN(modifiedCardId) && !isNaN(draggedCard) && isModifier) {
      const index = preSelectedCards.indexOf(modifiedCardId);
      if (index !== -1) {
        addModifier(modifiedCardId, draggedCard);
      }
    } else if (!isModifier && dropZone === "preselected") {
      if (!isCurrentlyPreselected) {
        registerCardDropOrigin(event, draggedCard);
      }
      setCardClicked(true);
      setStepIndex?.((stepIndex ?? 0) + 1);
      preSelectCard(draggedCard);
    } else if (!isModifier && dropZone === "hand") {
      if (isCurrentlyPreselected) {
        registerCardDropOrigin(event, draggedCard);
      }
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
            width="100%"
            maxHeight="70px"
            position="fixed"
            top={0}
            zIndex={0}
          />
          <Box sx={{ height: "100%", width: "100%" }} px={"40px"}>
            <Box
              sx={{
                height: "40%",
                width: "100%",
                overflow: "visible",
                position: "relative",
              }}
              pt={"60px"}
            >
              <TopSection
                onTutorialCardClick={() => {
                  if (run) {
                    setButtonClicked(true);
                    setStepIndex?.((stepIndex ?? 0) + 1);
                  }
                }}
              />
            </Box>
            <Box
              height={"60%"}
              width={"100%"}
              position="relative"
              zIndex={350}
            >
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                autoScroll={false}
              >
                <Box
                  ref={cardsStageRef}
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  <Box
                    sx={{
                      height: "45%",
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
                      cardsAnchorRef={preselectedCardsAnchorRef}
                    />
                  </Box>
                  <Box
                    pb={"60px"}
                    ml={{ base: 10, md: 20 }}
                    mr={{ base: 10, md: 20 }}
                    sx={{
                      display: "flex",
                      height: "55%",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <HandSection cardsAnchorRef={handCardsAnchorRef} />
                  </Box>
                  <SharedPlayableCardsLayer
                    stageRef={cardsStageRef}
                    handAnchorRef={handCardsAnchorRef}
                    preselectedAnchorRef={preselectedCardsAnchorRef}
                    deckAnchorRef={deckAnchorRef}
                    dragDropOrigins={dragDropOrigins}
                    onTutorialHandCardClick={() => {
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
            width="100%"
            position="fixed"
            bottom={0}
            sx={{ pointerEvents: "none" }}
          />
        </Box>

        <PositionedGameDeck deckAnchorRef={deckAnchorRef} />
      </Box>
    </Box>
  );
};
