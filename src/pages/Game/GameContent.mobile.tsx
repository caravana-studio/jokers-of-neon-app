import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Joyride, { CallBackProps } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { DeckPreviewTable } from "../../components/DeckPreview/DeckPreviewTable.tsx";
import { Loading } from "../../components/Loading.tsx";
import { MobileBottomBar } from "../../components/MobileBottomBar.tsx";
import { MobileCardHighlight } from "../../components/MobileCardHighlight.tsx";
import { MobileDecoration } from "../../components/MobileDecoration.tsx";
import { MotionBox } from "../../components/MotionBox.tsx";
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
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider.tsx";
import { useCurrentHandStore } from "../../state/useCurrentHandStore.ts";
import { useDeckPreviewHoldStore } from "../../state/useDeckPreviewHoldStore.ts";
import { useGameStore } from "../../state/useGameStore.ts";
import { logEvent } from "../../utils/analytics.ts";
import { isTutorial } from "../../utils/isTutorial.ts";
import { DiscardButton } from "./DiscardButton.tsx";
import { HandSection } from "./HandSection.tsx";
import { PlayButton } from "./PlayButton.tsx";
import { PowerUps } from "./PowerUps.tsx";
import { MobilePreselectedCardsSection } from "./PreselectedCardsSection.mobile.tsx";
import { SharedPlayableCardsLayer } from "./SharedPlayableCardsLayer.tsx";
import { MobileTopSection } from "./TopSection.mobile.tsx";

enum HighlightedType {
  Play,
  Discard,
}

type CardDropOrigin = {
  left: number;
  top: number;
  token: number;
};

export const MobileGameContent = () => {
  const inTutorial = isTutorial();
  const { executeCreateGame, resetLevel, stepIndex, setStepIndex } =
    useGameContext();

  const { highlightedItem: highlightedCard } = useCardHighlight();
  const {
    preSelectCard,
    unPreSelectCard,
    preSelectedCards,
    hand,
    addModifier,
  } = useCurrentHandStore();

  const {
    state,
    maxPowerUpSlots,
    gameLoading,
    gameError: error,
    id: gameId,
  } = useGameStore();

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
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();
  const [highlightedPlay, setHighlightedPlay] = useState(false);
  const [highlightedDiscard, setHighlightedDiscard] = useState(false);
  const [canClickPowerUp, setCanClickPowerUp] = useState(false);
  const isDeckPreviewVisible = useDeckPreviewHoldStore(
    (store) => store.isDeckPreviewVisible
  );
  const setDeckPreviewVisible = useDeckPreviewHoldStore(
    (store) => store.setDeckPreviewVisible
  );
  const cardsStageRef = useRef<HTMLDivElement>(null);
  const handCardsAnchorRef = useRef<HTMLDivElement>(null);
  const preselectedCardsAnchorRef = useRef<HTMLDivElement>(null);
  const dropOriginTokenRef = useRef(0);
  const [dragDropOrigins, setDragDropOrigins] = useState<
    Record<number, CardDropOrigin>
  >({});

  useEffect(() => {
    setRun(inTutorial);
  }, []);

  useEffect(() => {
    return () => setDeckPreviewVisible(false);
  }, [setDeckPreviewVisible]);

  const stepData = [
    { step: 13, delay: 2700 },
    { step: 22, delay: 4200 },
    { step: 32, delay: 7500 },
  ];

  const btnHighlight = [
    { step: 4, type: HighlightedType.Discard },
    { step: 7, type: HighlightedType.Discard },
    { step: 12, type: HighlightedType.Play },
    { step: 21, type: HighlightedType.Play },
    { step: 31, type: HighlightedType.Play },
  ];

  const powerUpClick = [{ step: 19 }, { step: 20 }];

  useEffect(() => {
    const stepInfo = stepData.find((data) => data.step === stepIndex);

    if (stepInfo) {
      setRun(false);
      const timeout = setTimeout(() => {
        setAutoStep(true);
        setStepIndex?.((stepIndex ?? 0) + 1);
        setRun(true);
      }, stepInfo.delay);

      return () => clearTimeout(timeout);
    }
  }, [stepIndex]);

  const handleJoyrideCallbackFactory = (
    setRunCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (data: CallBackProps) => {
      const { type, status } = data;

      if (type === "error:target_not_found") {
        setStepIndex?.((stepIndex ?? 0) + 1);
        return;
      }

      if (
        type === "step:after" &&
        !cardClicked &&
        !buttonClicked &&
        !autoStep
      ) {
        setStepIndex?.((stepIndex ?? 0) + 1);
      }

      setCardClicked(false);
      setButtonClicked(false);
      setAutoStep(false);

      const stepInfo = btnHighlight.find((data) => data.step === stepIndex);
      if (stepInfo) {
        if (stepInfo.type === HighlightedType.Discard)
          setHighlightedDiscard(true);
        else setHighlightedPlay(true);
      } else {
        setHighlightedDiscard(false);
        setHighlightedPlay(false);
      }

      const powerUpStep = powerUpClick.find((data) => data.step === stepIndex);
      if (powerUpStep) {
        setCanClickPowerUp(true);
      } else {
        setCanClickPowerUp(false);
      }

      if (type === "tour:end") {
        logEvent(
          status === "skipped" ? "tutorial_skipped" : "tutorial_finished"
        );
        logEvent("tutorial_done");
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
    const isModifier = hand.find((c) => c.idx === draggedCard)?.isModifier;
    const isCurrentlyPreselected = preSelectedCards.includes(draggedCard);
    const overId = event.over?.id;
    const targetCard = hand.find((card) => card.id === String(overId));
    const numericOverId = Number(overId);
    const modifiedCard =
      targetCard?.idx ?? (Number.isNaN(numericOverId) ? NaN : numericOverId);
    const dropZone = resolveDropZone(event);

    if (!isNaN(modifiedCard) && !isNaN(draggedCard) && isModifier) {
      const index = preSelectedCards.indexOf(modifiedCard);
      if (index !== -1) {
        addModifier(modifiedCard, draggedCard);
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
        <Heading zIndex={1} size="xl" variant="neonGreen">
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
      {highlightedCard && (
        <MobileCardHighlight
          card={highlightedCard}
          confirmationBtn
          showCumulativeProgress
        />
      )}
      <MobileDecoration />
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
      </Box>
      <AnimatePresence>
        {isDeckPreviewVisible && (
          <MotionBox
            position="fixed"
            zIndex={1300}
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            pointerEvents="none"
            width="95vw"
            maxWidth="95vw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Flex justifyContent="center">
              <Box width="100%" sx={{ "& table": { width: "100%" } }}>
                <DeckPreviewTable />
              </Box>
            </Flex>
          </MotionBox>
        )}
      </AnimatePresence>

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
            ref={cardsStageRef}
            paddingTop={4}
            sx={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "visible",
            }}
          >
            <Flex
              flexDir="column"
              alignItems="center"
              mt={3}
              sx={{ height: "245px", width: "100%" }}
            >
              <MobileTopSection />
              {(maxPowerUpSlots === undefined || maxPowerUpSlots > 0) && (
                <Flex mt={2} w="100%" justifyContent="center">
                  <PowerUps
                    onTutorialCardClick={() => {
                      if (run && canClickPowerUp) {
                        setButtonClicked(true);
                        setStepIndex?.((stepIndex ?? 0) + 1);
                      }
                    }}
                  />
                </Flex>
              )}
            </Flex>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            >
              <MobilePreselectedCardsSection
                cardsAnchorRef={preselectedCardsAnchorRef}
              />
            </Box>
            <Box
              mt={2}
              pb={2}
              w="100%"
              display={"flex"}
              justifyContent={"center"}
            >
              <Flex width="100%" px={2.5} justifyContent="center">
                <HandSection cardsAnchorRef={handCardsAnchorRef} />
              </Flex>
            </Box>
            <MobileBottomBar
              firstButtonReactNode={
                <DiscardButton
                  inTutorial={run}
                  highlight={highlightedDiscard}
                  onTutorialCardClick={() => {
                    if (run) {
                      setCardClicked(true);
                      setStepIndex?.((stepIndex ?? 0) + 1);
                    }
                  }}
                />
              }
              secondButtonReactNode={
                <PlayButton
                  inTutorial={run}
                  highlight={highlightedPlay}
                  onTutorialCardClick={() => {
                    if (run) {
                      setCardClicked(true);
                      setStepIndex?.((stepIndex ?? 0) + 1);
                    }
                  }}
                />
              }
            />
            <SharedPlayableCardsLayer
              stageRef={cardsStageRef}
              handAnchorRef={handCardsAnchorRef}
              preselectedAnchorRef={preselectedCardsAnchorRef}
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
  );
};
