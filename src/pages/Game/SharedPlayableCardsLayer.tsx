import { useDndContext } from "@dnd-kit/core";
import { motion } from "framer-motion";
import {
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatedCard } from "../../components/AnimatedCard";
import { ModifiableCard } from "../../components/ModifiableCard";
import { TiltCard } from "../../components/TiltCard";
import { TUTORIAL_STEPS } from "../../constants/gameTutorial";
import { dealSfx, preselectedCardSfx } from "../../constants/sfx";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { useAudio } from "../../hooks/useAudio";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";
import { useGameContext } from "../../providers/GameProvider";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";
import { useSettings } from "../../providers/SettingsProvider";
import { useAnimationStore } from "../../state/useAnimationStore";
import { useCurrentHandStore } from "../../state/useCurrentHandStore";
import { useGameStore } from "../../state/useGameStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { isTutorial } from "../../utils/isTutorial";
import {
  CARD_DEAL_TRANSITION,
  CARD_LAYOUT_TRANSITION,
  getCardDealStaggerSeconds,
  getCardDealFromDeckInitial,
} from "./cardLayoutMotion";

interface SharedPlayableCardsLayerProps {
  stageRef: RefObject<HTMLDivElement>;
  handAnchorRef: RefObject<HTMLDivElement>;
  preselectedAnchorRef: RefObject<HTMLDivElement>;
  deckAnchorRef?: RefObject<HTMLDivElement>;
  onTutorialHandCardClick?: () => void;
  dragDropOrigins?: Record<number, CardDropOrigin>;
}

type CardTargetPosition = {
  left: number;
  top: number;
  handOrder?: number;
};

type CardDropOrigin = {
  left: number;
  top: number;
  token: number;
};

type RectSnapshot = {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

type StageLayoutRects = {
  stage: RectSnapshot;
  hand: RectSnapshot;
  preselected: RectSnapshot;
};

type CardRenderSnapshot = {
  renderId: number;
  signature: string;
  idx: number;
};

const PRESELECTED_AREA_HORIZONTAL_PADDING = 12;
const HAND_AREA_HORIZONTAL_PADDING_DESKTOP = 12;
const HAND_AREA_HORIZONTAL_PADDING_MOBILE = 8;
const MIN_RECT_SIZE_PX = 16;
const RECT_DIFF_THRESHOLD = 0.5;
const INITIAL_LAYOUT_SAMPLE_INTERVAL_MS = 120;
const INITIAL_LAYOUT_SAMPLE_DURATION_MS = 2400;

const isValidRect = (
  rect: DOMRect,
  minWidth = MIN_RECT_SIZE_PX,
  minHeight = MIN_RECT_SIZE_PX
) =>
  Number.isFinite(rect.left) &&
  Number.isFinite(rect.top) &&
  rect.width >= minWidth &&
  rect.height >= minHeight;

const toSnapshot = (rect: DOMRect): RectSnapshot => ({
  left: rect.left,
  top: rect.top,
  width: rect.width,
  height: rect.height,
  right: rect.right,
  bottom: rect.bottom,
});

const toRelativeSnapshot = (
  rect: DOMRect,
  stageRect: DOMRect
): RectSnapshot => {
  const left = rect.left - stageRect.left;
  const top = rect.top - stageRect.top;
  const width = rect.width;
  const height = rect.height;

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
};

const sameRect = (a: RectSnapshot, b: RectSnapshot) => {
  if (!a || !b) return false;

  return (
    Math.abs(a.left - b.left) < RECT_DIFF_THRESHOLD &&
    Math.abs(a.top - b.top) < RECT_DIFF_THRESHOLD &&
    Math.abs(a.width - b.width) < RECT_DIFF_THRESHOLD &&
    Math.abs(a.height - b.height) < RECT_DIFF_THRESHOLD
  );
};

export const SharedPlayableCardsLayer = ({
  stageRef,
  handAnchorRef,
  preselectedAnchorRef,
  deckAnchorRef,
  onTutorialHandCardClick,
  dragDropOrigins,
}: SharedPlayableCardsLayerProps) => {
  const { stepIndex, changeModifierCard } = useGameContext();
  const { t } = useTranslation(["game"]);
  const { discardAnimation, playAnimation } = useAnimationStore();
  const { sfxVolume, animationSpeed } = useSettings();
  const { play: preselectCardSound } = useAudio(preselectedCardSfx, sfxVolume);
  const { play: dealCardSound } = useAudio(dealSfx, sfxVolume);
  const { highlightItem: highlightCard } = useCardHighlight();
  const { animatedCard } = useCardAnimations();

  const { activeNode } = useDndContext();
  const { cardScale, isSmallScreen } = useResponsiveValues();
  const remainingPlays = useGameStore((store) => store.remainingPlays);

  const {
    hand,
    preSelectedCards,
    preSelectedModifiers,
    togglePreselected,
    getModifiers,
  } = useCurrentHandStore();

  const [changingModifierIdx, setChangingModifierIdx] = useState<number | null>(
    null
  );
  const [hoveredModifierCard, setHoveredModifierCard] = useState<number | null>(
    null
  );
  const [hoveredModifierButton, setHoveredModifierButton] = useState<
    number | null
  >(null);

  const assignedModifierCardsSet = useMemo(() => {
    const assignedIndexes = new Set<number>();
    Object.values(preSelectedModifiers).forEach((modifierIdxList) => {
      modifierIdxList.forEach((idx) => assignedIndexes.add(idx));
    });
    return assignedIndexes;
  }, [preSelectedModifiers]);

  const traditionalCards = useMemo(
    () => hand.filter((card) => !card.isModifier),
    [hand]
  );

  const preselectedCardsSet = useMemo(
    () => new Set(preSelectedCards),
    [preSelectedCards]
  );

  const handCards = useMemo(
    () =>
      hand.filter((card) => {
        if (preselectedCardsSet.has(card.idx)) return false;
        if (card.isModifier && assignedModifierCardsSet.has(card.idx))
          return false;
        return true;
      }),
    [assignedModifierCardsSet, hand, preselectedCardsSet]
  );

  const preselectedTraditionalCards = useMemo(() => {
    const byIdx = new Map(traditionalCards.map((card) => [card.idx, card]));
    return preSelectedCards
      .map((idx) => byIdx.get(idx))
      .filter((card): card is Card => Boolean(card));
  }, [traditionalCards, preSelectedCards]);

  const handCardsSet = useMemo(
    () => new Set(handCards.map((card) => card.idx)),
    [handCards]
  );

  const handLayoutCards = useMemo(
    () => hand.filter((card) => !assignedModifierCardsSet.has(card.idx)),
    [assignedModifierCardsSet, hand]
  );

  const handLayoutOrderByCardIdx = useMemo(
    () => new Map(handLayoutCards.map((card, order) => [card.idx, order])),
    [handLayoutCards]
  );

  const preselectedOrderByCardIdx = useMemo(
    () =>
      new Map(
        preselectedTraditionalCards.map((card, order) => [card.idx, order])
      ),
    [preselectedTraditionalCards]
  );

  const renderedCardWidth = (CARD_WIDTH + (isSmallScreen ? 12 : 8)) * cardScale;
  const renderedCardHeight =
    (CARD_HEIGHT + (isSmallScreen ? 12 : 8)) * cardScale;
  const handAreaHorizontalPadding = isSmallScreen
    ? HAND_AREA_HORIZONTAL_PADDING_MOBILE
    : HAND_AREA_HORIZONTAL_PADDING_DESKTOP;
  const isTutorialRunning = isTutorial();

  const [layoutRects, setLayoutRects] = useState<StageLayoutRects | null>(null);

  const [dealAnimationTokens, setDealAnimationTokens] = useState<Record<number, number>>({});
  const [dealAnimationDelayByCard, setDealAnimationDelayByCard] = useState<
    Record<number, number>
  >({});
  const [freshDealAnimationTokens, setFreshDealAnimationTokens] = useState<
    Record<number, number>
  >({});
  const previousHandRef = useRef<Card[]>([]);
  const previousCardRenderSnapshotsRef = useRef<CardRenderSnapshot[]>([]);
  const nextRenderIdRef = useRef(1);
  const consumedDragDropTokensRef = useRef<Record<number, number>>({});
  const dealSoundTimeoutIdsRef = useRef<number[]>([]);
  const dealStaggerSeconds = useMemo(
    () => getCardDealStaggerSeconds(animationSpeed),
    [animationSpeed]
  );
  const getCardSignature = useCallback(
    (card: Pick<Card, "img" | "isModifier">) =>
      `${card.img}-${card.isModifier ? "modifier" : "card"}`,
    []
  );

  const handRenderData = useMemo(() => {
    const previousSnapshots = previousCardRenderSnapshotsRef.current;
    const usedPreviousSnapshotIndexes = new Set<number>();
    const renderIdByCardIdx: Record<number, number> = {};
    const newlyDealtCardIndexes: number[] = [];
    const nextSnapshots: CardRenderSnapshot[] = [];

    hand.forEach((card) => {
      const signature = getCardSignature(card);
      let matchedPreviousSnapshotIndex = previousSnapshots.findIndex(
        (snapshot, index) =>
          !usedPreviousSnapshotIndexes.has(index) &&
          snapshot.signature === signature &&
          snapshot.idx === card.idx
      );

      if (matchedPreviousSnapshotIndex === -1) {
        matchedPreviousSnapshotIndex = previousSnapshots.findIndex(
          (snapshot, index) =>
            !usedPreviousSnapshotIndexes.has(index) &&
            snapshot.signature === signature
        );
      }

      let renderId: number;
      if (matchedPreviousSnapshotIndex === -1) {
        renderId = nextRenderIdRef.current++;
        newlyDealtCardIndexes.push(card.idx);
      } else {
        usedPreviousSnapshotIndexes.add(matchedPreviousSnapshotIndex);
        renderId = previousSnapshots[matchedPreviousSnapshotIndex].renderId;
      }

      renderIdByCardIdx[card.idx] = renderId;
      nextSnapshots.push({
        renderId,
        signature,
        idx: card.idx,
      });
    });

    return {
      renderIdByCardIdx,
      newlyDealtCardIndexes,
      nextSnapshots,
    };
  }, [getCardSignature, hand]);

  useEffect(() => {
    return () => {
      dealSoundTimeoutIdsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      dealSoundTimeoutIdsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (playAnimation || discardAnimation) {
      dealCardSound();
    }
  }, [dealCardSound, discardAnimation, playAnimation]);

  useEffect(() => {
    previousCardRenderSnapshotsRef.current = handRenderData.nextSnapshots;
  }, [handRenderData.nextSnapshots]);

  useEffect(() => {
    const previousCards = previousHandRef.current;
    const currentHandIndexes = new Set(hand.map((card) => card.idx));
    const currentHandAreaIndexes = new Set(handCards.map((card) => card.idx));
    setDealAnimationDelayByCard((currentDelays) => {
      const nextDelays = { ...currentDelays };
      Object.keys(nextDelays).forEach((idx) => {
        if (!currentHandIndexes.has(Number(idx))) {
          delete nextDelays[Number(idx)];
        }
      });
      return nextDelays;
    });

    setDealAnimationTokens((currentTokens) => {
      const cleanedTokens: Record<number, number> = {};
      Object.entries(currentTokens).forEach(([idx, token]) => {
        const numericIdx = Number(idx);
        // Keep animation tokens while the card still exists in this hand, even if
        // it temporarily moves between hand and preselected lanes.
        if (currentHandIndexes.has(numericIdx)) {
          cleanedTokens[numericIdx] = token;
        }
      });

      if (previousCards.length === 0) {
        return cleanedTokens;
      }

      const newlyDealtCardIndexes = handRenderData.newlyDealtCardIndexes.filter(
        (cardIdx) => currentHandAreaIndexes.has(cardIdx)
      );

      if (newlyDealtCardIndexes.length === 0) {
        return cleanedTokens;
      }

      const nextTokens = { ...cleanedTokens };
      const freshTokens: Record<number, number> = {};
      const nextDelaysByCard: Record<number, number> = {};

      newlyDealtCardIndexes.forEach((cardIdx, dealOrder) => {
        const nextToken = (nextTokens[cardIdx] ?? 0) + 1;
        nextTokens[cardIdx] = nextToken;
        freshTokens[cardIdx] = nextToken;
        const dealDelay = dealOrder * dealStaggerSeconds;
        nextDelaysByCard[cardIdx] = dealDelay;

        const timeoutId = window.setTimeout(() => {
          dealCardSound();
          dealSoundTimeoutIdsRef.current = dealSoundTimeoutIdsRef.current.filter(
            (id) => id !== timeoutId
          );
        }, Math.max(0, Math.round(dealDelay * 1000)));
        dealSoundTimeoutIdsRef.current.push(timeoutId);
      });

      setFreshDealAnimationTokens((currentFreshTokens) => {
        const nextFreshTokens = { ...currentFreshTokens, ...freshTokens };
        Object.keys(nextFreshTokens).forEach((idx) => {
          if (!currentHandAreaIndexes.has(Number(idx))) {
            delete nextFreshTokens[Number(idx)];
          }
        });
        return nextFreshTokens;
      });

      setDealAnimationDelayByCard((currentDelays) => ({
        ...currentDelays,
        ...nextDelaysByCard,
      }));

      window.setTimeout(() => {
        setFreshDealAnimationTokens((currentFreshTokens) => {
          const nextFreshTokens = { ...currentFreshTokens };
          newlyDealtCardIndexes.forEach((cardIdx) => {
            delete nextFreshTokens[cardIdx];
          });
          return nextFreshTokens;
        });
      }, 0);

      return nextTokens;
    });

    previousHandRef.current = hand;
  }, [
    dealCardSound,
    dealStaggerSeconds,
    hand,
    handRenderData.newlyDealtCardIndexes,
  ]);

  const refreshAnchorRects = useCallback(() => {
    const nextStageRectRaw = stageRef.current?.getBoundingClientRect();
    const nextHandRectRaw = handAnchorRef.current?.getBoundingClientRect();
    const nextPreselectedRectRaw =
      preselectedAnchorRef.current?.getBoundingClientRect();

    if (
      !nextStageRectRaw ||
      !isValidRect(
        nextStageRectRaw,
        renderedCardWidth * 1.2,
        renderedCardHeight * 1.2
      )
    ) {
      return;
    }

    const minimumAnchorHeight = Math.max(renderedCardHeight * 0.55, MIN_RECT_SIZE_PX);
    const handWidthThreshold =
      renderedCardWidth + handAreaHorizontalPadding * 2;
    const preselectedWidthThreshold =
      renderedCardWidth + PRESELECTED_AREA_HORIZONTAL_PADDING * 2;

    setLayoutRects((previousRects) => {
      const nextStageRect = toSnapshot(nextStageRectRaw);

      const nextHandRect =
        nextHandRectRaw &&
        isValidRect(nextHandRectRaw, handWidthThreshold, minimumAnchorHeight)
          ? toRelativeSnapshot(nextHandRectRaw, nextStageRectRaw)
          : previousRects?.hand ?? null;

      const nextPreselectedRect =
        nextPreselectedRectRaw &&
        isValidRect(
          nextPreselectedRectRaw,
          preselectedWidthThreshold,
          minimumAnchorHeight
        )
          ? toRelativeSnapshot(nextPreselectedRectRaw, nextStageRectRaw)
          : previousRects?.preselected ?? null;

      if (!nextHandRect || !nextPreselectedRect) {
        return previousRects;
      }

      if (
        previousRects &&
        sameRect(previousRects.stage, nextStageRect) &&
        sameRect(previousRects.hand, nextHandRect) &&
        sameRect(previousRects.preselected, nextPreselectedRect)
      ) {
        return previousRects;
      }

      return {
        stage: nextStageRect,
        hand: nextHandRect,
        preselected: nextPreselectedRect,
      };
    });
  }, [
    handAreaHorizontalPadding,
    handAnchorRef,
    preselectedAnchorRef,
    renderedCardHeight,
    renderedCardWidth,
    stageRef,
  ]);

  useLayoutEffect(() => {
    refreshAnchorRects();
  }, [refreshAnchorRects]);

  useEffect(() => {
    let rafId: number | null = null;

    const scheduleRefresh = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        refreshAnchorRects();
      });
    };

    scheduleRefresh();

    const resizeObserver = new ResizeObserver(scheduleRefresh);
    if (stageRef.current) {
      resizeObserver.observe(stageRef.current);
    }
    if (handAnchorRef.current) {
      resizeObserver.observe(handAnchorRef.current);
    }
    if (preselectedAnchorRef.current) {
      resizeObserver.observe(preselectedAnchorRef.current);
    }

    const initialSampleInterval = window.setInterval(
      scheduleRefresh,
      INITIAL_LAYOUT_SAMPLE_INTERVAL_MS
    );
    const clearInitialSamplerTimeout = window.setTimeout(() => {
      window.clearInterval(initialSampleInterval);
    }, INITIAL_LAYOUT_SAMPLE_DURATION_MS);

    window.addEventListener("resize", scheduleRefresh);
    window.addEventListener("scroll", scheduleRefresh, true);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      window.clearInterval(initialSampleInterval);
      window.clearTimeout(clearInitialSamplerTimeout);
      window.removeEventListener("resize", scheduleRefresh);
      window.removeEventListener("scroll", scheduleRefresh, true);
    };
  }, [handAnchorRef, preselectedAnchorRef, refreshAnchorRects, stageRef]);

  const getHorizontalStep = (
    count: number,
    cardSize: number,
    availableSize: number,
    maxStep: number
  ) => {
    if (count <= 1) return 0;
    const fitStep = (availableSize - cardSize) / (count - 1);
    return Math.max(0, Math.min(maxStep, fitStep));
  };

  const getHandCardPosition = (
    order: number,
    count: number
  ): CardTargetPosition | null => {
    const handAnchorRect = layoutRects?.hand;
    if (!handAnchorRect) return null;

    const availableWidth = Math.max(
      renderedCardWidth,
      handAnchorRect.width - handAreaHorizontalPadding * 2
    );
    const step = getHorizontalStep(
      count,
      renderedCardWidth,
      availableWidth,
      renderedCardWidth * (isSmallScreen ? 1.1 : 0.72)
    );
    const totalWidth = renderedCardWidth + step * Math.max(count - 1, 0);
    const leftStart = handAnchorRect.left + (handAnchorRect.width - totalWidth) / 2;

    return {
      left: leftStart + step * order,
      top:
        handAnchorRect.top +
        (handAnchorRect.height - renderedCardHeight) / 2,
      handOrder: order,
    };
  };

  const getPreselectedCardPosition = (
    order: number,
    count: number
  ): CardTargetPosition | null => {
    const preselectedAnchorRect = layoutRects?.preselected;
    if (!preselectedAnchorRect) return null;

    const availableWidth = Math.max(
      renderedCardWidth,
      preselectedAnchorRect.width - PRESELECTED_AREA_HORIZONTAL_PADDING * 2
    );
    const step = getHorizontalStep(
      count,
      renderedCardWidth,
      availableWidth,
      renderedCardWidth * (isSmallScreen ? 1.15 : 1.2)
    );
    const totalWidth = renderedCardWidth + step * Math.max(count - 1, 0);
    const leftStart =
      preselectedAnchorRect.left + (preselectedAnchorRect.width - totalWidth) / 2;

    return {
      left: leftStart + step * order,
      top:
        preselectedAnchorRect.top +
        (preselectedAnchorRect.height - renderedCardHeight) / 2,
    };
  };

  if (!layoutRects) {
    return null;
  }

  const fallbackDeckOrigin = isSmallScreen
    ? {
        left: Math.max(0, (layoutRects.stage.width - renderedCardWidth) / 2),
        top: Math.max(0, layoutRects.stage.height - renderedCardHeight * 0.6),
      }
    : {
        left: Math.max(0, layoutRects.stage.width - renderedCardWidth * 0.45),
        top: Math.max(0, layoutRects.stage.height - renderedCardHeight * 0.45),
      };
  const deckAnchorRect = deckAnchorRef?.current?.getBoundingClientRect();
  const stageRectRaw = stageRef.current?.getBoundingClientRect();

  const deckOrigin =
    !isSmallScreen &&
    deckAnchorRect &&
    stageRectRaw &&
    isValidRect(deckAnchorRect, 1, 1)
      ? {
          left: Math.max(
            0,
            deckAnchorRect.left -
              stageRectRaw.left +
              (deckAnchorRect.width - renderedCardWidth) / 2
          ),
          top: Math.max(
            0,
            deckAnchorRect.top -
              stageRectRaw.top +
              (deckAnchorRect.height - renderedCardHeight) / 2
          ),
        }
      : fallbackDeckOrigin;

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 320,
        overflow: "visible",
      }}
    >
      {hand
        .filter((card) => handCardsSet.has(card.idx) || preselectedCardsSet.has(card.idx))
        .map((card) => {
        const isModifierCard = card.isModifier;
        const isPreselected = !isModifierCard && preselectedCardsSet.has(card.idx);
        const handOrder = handLayoutOrderByCardIdx.get(card.idx);
        const preselectedOrder = preselectedOrderByCardIdx.get(card.idx);
        const currentStepConfig = TUTORIAL_STEPS[stepIndex ?? 0];
        const targetSelector = currentStepConfig?.target;

        const handCardClassName =
          handOrder !== undefined ? `hand-element-${handOrder}` : undefined;
        const isActiveTutorialStep =
          handCardClassName !== undefined &&
          targetSelector === `.${handCardClassName}`;

        const isAnyHandCardTargeted = targetSelector
          ?.toString()
          .startsWith(".hand-element-");

        const isClickDisabled =
          isTutorialRunning &&
          !isPreselected &&
          !isModifierCard &&
          isAnyHandCardTargeted &&
          !isActiveTutorialStep;

        const targetPosition = isPreselected
          ? getPreselectedCardPosition(
              preselectedOrder ?? 0,
              preselectedTraditionalCards.length
            )
          : getHandCardPosition(
              handOrder ?? 0,
              handLayoutCards.length
            );

        if (!targetPosition) return null;

        const dealAnimationToken = dealAnimationTokens[card.idx] ?? 0;
        const dragDropAnimationToken = dragDropOrigins?.[card.idx]?.token ?? 0;
        const consumedDragDropToken =
          consumedDragDropTokensRef.current[card.idx] ?? 0;
        const showDealAnimation =
          !isPreselected &&
          freshDealAnimationTokens[card.idx] === dealAnimationToken &&
          dealAnimationToken > 0;
        const showDragDropAnimation =
          dragDropAnimationToken > consumedDragDropToken &&
          Boolean(dragDropOrigins?.[card.idx]);
        const dealDelay =
          showDealAnimation ? dealAnimationDelayByCard[card.idx] ?? 0 : 0;

        if (showDragDropAnimation) {
          consumedDragDropTokensRef.current[card.idx] = dragDropAnimationToken;
        }

        const cardRenderId = handRenderData.renderIdByCardIdx[card.idx] ?? card.idx;
        const cardTransitionKey = `game-card-${cardRenderId}-${dealAnimationToken}-${dragDropAnimationToken}`;
        const renderedCard: Card = {
          ...card,
          modifiers: getModifiers(card.idx),
        };
        const canReceiveModifier = !isModifierCard && isPreselected;
        const tutorialOffsetY = isActiveTutorialStep ? -20 : 0;

        const cardContent = (
          <Flex
            position="relative"
            onMouseEnter={() => {
              if (!isSmallScreen && isModifierCard) {
                setHoveredModifierCard(card.idx);
              }
            }}
            onMouseLeave={() => {
              if (!isSmallScreen && isModifierCard) {
                setHoveredModifierCard(null);
                setHoveredModifierButton(null);
              }
            }}
          >
            {isModifierCard && hoveredModifierCard === card.idx && (
              <Flex
                position={"absolute"}
                zIndex={25}
                bottom={"5px"}
                left={"5px"}
                borderRadius={"10px"}
                background={"violet"}
              >
                <Button
                  height={8}
                  fontSize="8px"
                  px={"16px"}
                  borderRadius={"10px"}
                  size={isSmallScreen ? "xs" : "md"}
                  variant={"discardSecondarySolid"}
                  onMouseEnter={() => setHoveredModifierButton(card.idx)}
                  onMouseLeave={() => setHoveredModifierButton(null)}
                  display="flex"
                  gap={4}
                  isDisabled={changingModifierIdx === card.idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setChangingModifierIdx(card.idx);
                    changeModifierCard(card.idx).finally(() => {
                      setChangingModifierIdx(null);
                      setHoveredModifierButton(null);
                    });
                  }}
                >
                  <Text fontSize="10px">X</Text>
                  {hoveredModifierButton === card.idx && (
                    <Text fontSize="10px">
                      {t("game.hand-section.modifier-change")}
                    </Text>
                  )}
                </Button>
              </Flex>
            )}
            <AnimatedCard
              idx={card.idx}
              discarded={isPreselected ? discardAnimation : card.discarded}
              played={isPreselected ? playAnimation : false}
              scale={cardScale}
            >
              <TiltCard
                card={renderedCard}
                scale={cardScale}
                cursor={
                  isModifierCard
                    ? activeNode
                      ? "grabbing"
                      : "grab"
                    : activeNode
                      ? "grabbing"
                      : "pointer"
                }
                onClick={() => {
                  if (isModifierCard) {
                    highlightCard(card);
                    return;
                  }

                  if (isPreselected) {
                    togglePreselected(card.idx);
                    return;
                  }

                  if (isClickDisabled) return;

                  onTutorialHandCardClick?.();
                  const preselected = togglePreselected(card.idx);
                  if (preselected) {
                    preselectCardSound();
                  }
                }}
                className={
                  isModifierCard
                    ? "tutorial-modifiers-step-2"
                    : handCardClassName
                }
                onHold={() => {
                  if (isModifierCard) {
                    isSmallScreen && highlightCard(card);
                    return;
                  }
                  if (!isPreselected && isClickDisabled) return;
                  isSmallScreen && highlightCard(card);
                }}
              />
            </AnimatedCard>
          </Flex>
        );

        return (
          <motion.div
            key={cardTransitionKey}
            initial={
              showDragDropAnimation
                ? {
                    x: dragDropOrigins?.[card.idx]?.left ?? targetPosition.left,
                    y:
                      (dragDropOrigins?.[card.idx]?.top ?? targetPosition.top) +
                      tutorialOffsetY,
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }
                : showDealAnimation
                ? {
                    ...getCardDealFromDeckInitial(!!isSmallScreen),
                    x: deckOrigin.left,
                    y: deckOrigin.top,
                  }
                : false
            }
            animate={{
              x: targetPosition.left,
              y: targetPosition.top + tutorialOffsetY,
              opacity: remainingPlays === 0 && !isPreselected ? 0.4 : 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              ...CARD_DEAL_TRANSITION,
              delay: dealDelay,
              x: {
                ...CARD_LAYOUT_TRANSITION,
                delay: dealDelay,
              },
              y: {
                ...CARD_LAYOUT_TRANSITION,
                delay: dealDelay,
              },
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              pointerEvents: "auto",
              willChange: "transform, opacity",
              zIndex: isActiveTutorialStep
                ? 999
                : isPreselected
                  ? 30
                  : 20 + (targetPosition.handOrder ?? 0),
            }}
          >
            {canReceiveModifier ? (
              <ModifiableCard id={card.id}>{cardContent}</ModifiableCard>
            ) : (
              cardContent
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
