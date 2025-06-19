import { Box, Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useCardHighlight } from "../providers/CardHighlightProvider.tsx";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useGameStore } from "../state/useGameStore.ts";
import { BACKGROUND_BLUE } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { AnimatedCard } from "./AnimatedCard.tsx";
import { CardImage3D } from "./CardImage3D.tsx";
import { CashSymbol } from "./CashSymbol.tsx";
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { LockedSlot } from "./LockedSlot/LockedSlot.tsx";
import { UnlockedSlot } from "./UnlockedSlot.tsx";

export const SpecialCardsRow = () => {
  const [discardedCards, setDiscardedCards] = useState<string[]>([]);
  const {
    sellSpecialCard,
    roundRewards,
    specialCards: cards,
    maxSpecialCards,
  } = useGameContext();
  const { isRageRound, isClassic } = useGameStore();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [cardToDiscardIdx, setCardToDiscardIdx] = useState<number | null>(null);
  const { t } = useTranslation(["game"]);
  const { cardScale, isSmallScreen, isCardScaleCalculated } =
    useResponsiveValues();
  const cardWidth = CARD_WIDTH * cardScale;
  const cardHeight = CARD_HEIGHT * cardScale;

  const { highlightCard } = useCardHighlight();

  const { specialSlots } = useGameStore();

  const lockedSlots =
    specialSlots === maxSpecialCards ? 0 : Math.max(0, 5 - specialSlots);

  const freeUnlockedSlots = Math.max(0, 5 - cards.length - lockedSlots);

  const visibleCards = cards.length + freeUnlockedSlots + lockedSlots;

  const cardToDiscard = cards.find((c) => c.idx === cardToDiscardIdx);

  useEffect(() => {
    if (roundRewards) {
      setDiscardedCards((prev) => [
        ...prev,
        ...cards
          .filter((card) => card.temporary && card.remaining === 1)
          .map((card) => card.id),
      ]);
    }
  }, [roundRewards, cards]);

  const handleDiscard = () => {
    const card = cards.find((c) => c.idx === cardToDiscardIdx);
    if (card) {
      setHoveredButton(null);
      sellSpecialCard(cardToDiscardIdx!).then((response) => {
        if (response) {
          setDiscardedCards((prev) => [...prev, card.id]);
        }
      });
      setCardToDiscardIdx(null);
    }
  };

  const slotWidth = (visibleCards > 6 ? 88 : 92) / visibleCards;

  return (
    <Flex
      width="100%"
      gap={{ base: "8px", sm: "14px" }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      <SimpleGrid
        columns={visibleCards}
        position="relative"
        width={visibleCards > 5 ? "97%" : visibleCards > 6 ? "95%" : "100%"}
        alignItems={isSmallScreen ? "center" : "inherit"}
        columnGap={3}
        pb={isSmallScreen ? 0 : 4}
      >
        {cards.map((card) => {
          const isDiscarded = discardedCards.includes(card.id);
          return (
            <Flex
              className="special-cards-step-1"
              key={card.idx}
              justifyContent="flex-start"
              width={`${slotWidth}%`}
              maxWidth={`${slotWidth + 7}px`}
              position="relative"
              zIndex={1}
              onMouseEnter={() => !isSmallScreen && setHoveredCard(card.idx)}
              onMouseLeave={() => {
                setHoveredCard(null);
                setHoveredButton(null);
              }}
            >
              {!isDiscarded && (
                <AnimatedCard
                  idx={card.idx}
                  isSpecial={!!card.isSpecial}
                  scale={cardScale}
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
                            <>
                              <Text fontSize="10px">
                                {t(
                                  "game.special-cards.remove-special-cards-label"
                                )}
                                <CashSymbol /> {card.selling_price}
                              </Text>
                            </>
                          )}
                        </Button>
                      )}
                    </Flex>
                    <Box
                      width={`${cardWidth}px`}
                      onClick={() => {
                        isSmallScreen && highlightCard(card);
                      }}
                    >
                      <CardImage3D
                        card={card}
                        height={`${cardHeight}px`}
                        small
                      />
                    </Box>
                  </Box>
                </AnimatedCard>
              )}
            </Flex>
          );
        })}
        {Array.from({ length: freeUnlockedSlots }).map((_, index) => (
          <Flex
            key={`unlocked-slot-${index}`}
            maxWidth={`${slotWidth}%`}
            height={`${cardHeight}px`}
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
              scale={isCardScaleCalculated ? cardScale : undefined}
            />
          </Flex>
        ))}
        {Array.from({ length: lockedSlots }).map((_, index) => (
          <Flex
            key={`locked-slot-${index}`}
            maxWidth={`${slotWidth}%`}
            height={`${cardHeight}px`}
          >
            <LockedSlot
              key={`locked-${index}`}
              scale={cardScale}
              backgroundColor={
                visibleCards <= 5
                  ? "transparent"
                  : isRageRound
                    ? "black"
                    : "transparent"
              }
              borderRadius={isSmallScreen ? "0px" : "10%"}
            />
          </Flex>
        ))}
      </SimpleGrid>
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
