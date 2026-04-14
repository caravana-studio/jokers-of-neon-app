import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useCardHighlight } from "../providers/HighlightProvider/CardHighlightProvider.tsx";
import { useGameStore } from "../state/useGameStore.ts";
import { BACKGROUND_BLUE } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { AnimatedParticleCard } from "./AnimatedParticleCard.tsx";
import { CardImage3D } from "./CardImage3D.tsx";
import { CashSymbol } from "./CashSymbol.tsx";
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { LockedSlot } from "./LockedSlot/LockedSlot.tsx";
import { UnlockedSlot } from "./UnlockedSlot.tsx";

export const SpecialCardsRow = () => {
  const { sellSpecialCard } = useGameContext();
  const {
    isRageRound,
    isClassic,
    specialCards: cards,
    maxSpecialCards,
  } = useGameStore();

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [cardToDiscardIdx, setCardToDiscardIdx] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [rowWidth, setRowWidth] = useState(0);
  const { t } = useTranslation(["game"]);
  const { cardScale, isSmallScreen, isCardScaleCalculated } =
    useResponsiveValues();

  const { highlightItem: highlightCard } = useCardHighlight();

  const { specialSlots } = useGameStore();

  const cappedVisibleSlots = Math.min(Math.max(maxSpecialCards, 1), 5);
  const effectiveUnlockedSlots = Math.max(specialSlots, cards.length);
  const visibleCards = Math.max(cards.length, cappedVisibleSlots);
  const visiblePlaceholders = Math.max(0, visibleCards - cards.length);
  const freeUnlockedSlots = Math.min(
    visiblePlaceholders,
    Math.max(0, effectiveUnlockedSlots - cards.length),
  );
  const lockedSlots = Math.max(0, visiblePlaceholders - freeUnlockedSlots);
  const totalVisibleItems = cards.length + freeUnlockedSlots + lockedSlots;
  const baselineCount = 5;
  const minGapPx = isSmallScreen ? 8 : 12;

  const scaleForFive =
    rowWidth > 0
      ? (rowWidth - minGapPx * (baselineCount - 1)) /
        (CARD_WIDTH * baselineCount)
      : cardScale;
  const slotScale = Math.min(cardScale, Math.max(scaleForFive, 0.1));
  const slotWidthPx = CARD_WIDTH * slotScale;
  const slotHeightPx = CARD_HEIGHT * slotScale;

  const perItemSpacingPx =
    totalVisibleItems > 1 && rowWidth > 0
      ? (() => {
          if (totalVisibleItems < 5) {
            return minGapPx;
          }
          if (totalVisibleItems === 5) {
            return minGapPx;
          }
          const step = (rowWidth - slotWidthPx) / (totalVisibleItems - 1);
          const marginLeft = step - slotWidthPx;
          return marginLeft;
        })()
      : minGapPx;

  const slotContainerWidth = `${slotWidthPx}px`;

  const cardToDiscard = cards.find((c) => c.idx === cardToDiscardIdx);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const updateWidth = () => setRowWidth(node.clientWidth);
    updateWidth();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const handleDiscard = () => {
    const card = cards.find((c) => c.idx === cardToDiscardIdx);
    if (card) {
      setHoveredButton(null);
      card && sellSpecialCard(card);
      setCardToDiscardIdx(null);
    }
  };
  return (
    <Flex
      width="100%"
      gap={{ base: "8px", sm: "14px" }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      <Flex
        ref={rowRef}
        position="relative"
        width="100%"
        alignItems={isSmallScreen ? "center" : "inherit"}
        justifyContent="flex-start"
        gap={0}
        pb={isSmallScreen ? 3 : 4}
      >
        {cards.map((card, index) => {
          return (
            <Flex
              className="special-cards-step-1"
              key={card.idx}
              justifyContent="flex-start"
              width={slotContainerWidth}
              minWidth={slotContainerWidth}
              flexShrink={0}
              ml={index === 0 ? 0 : `${perItemSpacingPx}px`}
              position="relative"
              zIndex={
                hoveredCard === card.idx || hoveredButton === card.idx
                  ? totalVisibleItems + 100
                  : index + 1
              }
              onMouseEnter={() => !isSmallScreen && setHoveredCard(card.idx)}
              onMouseLeave={() => {
                setHoveredCard(null);
                setHoveredButton(null);
              }}
            >
              <AnimatedParticleCard
                idx={card.idx}
                isSpecial={!!card.isSpecial}
                scale={slotScale}
              >
                <Box position="relative">
                  <Flex
                    position={"absolute"}
                    zIndex={7}
                    bottom="5px"
                    left="5px"
                    borderRadius={"10px"}
                    background={"violet"}
                  >
                    {hoveredCard === card.idx && (
                      <Button
                        height={8}
                        fontSize="8px"
                        px={"16px"}
                        size={isSmallScreen ? "xs" : "md"}
                        borderRadius={"10px"}
                        variant={"discardSecondarySolid"}
                        display="flex"
                        gap={4}
                        onMouseEnter={() => setHoveredButton(card.idx)}
                        onClick={() => {
                          setCardToDiscardIdx(card.idx);
                        }}
                      >
                        <Text fontSize="10px">X</Text>
                        {hoveredButton === card.idx && (
                          <Flex alignItems="center" gap={1}>
                            <Text fontSize="10px">
                              {t(
                                "game.special-cards.remove-special-cards-label",
                              )}
                            </Text>
                            <CashSymbol size="10px" />
                            <Text fontSize="10px">{card.selling_price}</Text>
                          </Flex>
                        )}
                      </Button>
                    )}
                  </Flex>
                  <Box
                    width={`${slotWidthPx}px`}
                    onClick={() => {
                      isSmallScreen && highlightCard(card);
                    }}
                  >
                    <CardImage3D
                      card={card}
                      height={`${slotHeightPx}px`}
                      small
                      showCumulativeProgress
                    />
                  </Box>
                </Box>
              </AnimatedParticleCard>
            </Flex>
          );
        })}
        {Array.from({ length: freeUnlockedSlots }).map((_, index) => (
          <Flex
            key={`unlocked-slot-${index}`}
            width={slotContainerWidth}
            minWidth={slotContainerWidth}
            flexShrink={0}
            ml={cards.length + index === 0 ? 0 : `${perItemSpacingPx}px`}
            height={`${slotHeightPx}px`}
          >
            <UnlockedSlot
              key={`unlocked-${index}`}
              backgroundColor={
                visibleCards <= 5
                  ? "transparent"
                  : isClassic
                    ? isRageRound
                      ? "black"
                      : BACKGROUND_BLUE
                    : "transparent"
              }
              scale={isCardScaleCalculated ? slotScale : undefined}
            />
          </Flex>
        ))}
        {Array.from({ length: lockedSlots }).map((_, index) => (
          <Flex
            key={`locked-slot-${index}`}
            width={slotContainerWidth}
            minWidth={slotContainerWidth}
            flexShrink={0}
            ml={
              cards.length + freeUnlockedSlots + index === 0
                ? 0
                : `${perItemSpacingPx}px`
            }
            height={`${slotHeightPx}px`}
          >
            <LockedSlot
              key={`locked-${index}`}
              scale={slotScale}
              backgroundColor={
                visibleCards <= 5
                  ? "transparent"
                  : isRageRound
                    ? "black"
                    : "transparent"
              }
              borderRadius={isSmallScreen ? "0px" : "4px"}
            />
          </Flex>
        ))}
      </Flex>
      {cardToDiscardIdx !== null && (
        <ConfirmationModal
          close={() => setCardToDiscardIdx(null)}
          title={t("game.special-cards.confirmation-modal.title")}
          description={t("game.special-cards.confirmation-modal.description", {
            price: cardToDiscard?.selling_price ?? 0,
          })}
          onConfirm={handleDiscard}
        />
      )}
    </Flex>
  );
};
