import { Box, Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGame } from "../dojo/queries/useGame.tsx";
import { useCardHighlight } from "../providers/CardHighlightProvider.tsx";
import { useGameContext } from "../providers/GameProvider.tsx";
import { BACKGROUND_BLUE } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { AnimatedCard } from "./AnimatedCard.tsx";
import { CardImage3D } from "./CardImage3D.tsx";
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { LockedSlot } from "./LockedSlot.tsx";
import { UnlockedSlot } from "./UnlockedSlot.tsx";

export const SpecialCardsRow = () => {
  const [discardedCards, setDiscardedCards] = useState<string[]>([]);
  const {
    discardSpecialCard,
    roundRewards,
    isRageRound,
    specialCards: cards,
    maxSpecialCards,
  } = useGameContext();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [cardToDiscard, setCardToDiscard] = useState<number | null>(null);
  const { t } = useTranslation(["game"]);
  const { specialCardScale, isSmallScreen } = useResponsiveValues();
  const cardWidth = CARD_WIDTH * specialCardScale;
  const cardHeight = CARD_HEIGHT * specialCardScale;

  const { highlightCard } = useCardHighlight();

  const game = useGame();
  const unlockedSpecialSlots = game?.special_slots ?? 1;

  const lockedSlots =
    unlockedSpecialSlots === maxSpecialCards
      ? 0
      : Math.max(0, 5 - unlockedSpecialSlots);

  const freeUnlockedSlots = Math.max(0, 5 - cards.length - lockedSlots);

  const visibleCards = cards.length + freeUnlockedSlots + lockedSlots;

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
    const card = cards.find((c) => c.idx === cardToDiscard);
    if (card) {
      setHoveredButton(null);
      discardSpecialCard(cardToDiscard!).then((response) => {
        if (response) {
          setDiscardedCards((prev) => [...prev, card.id]);
        }
      });
      setCardToDiscard(null);
    }
  };

  const slotWidth = (visibleCards > 6 ? 88 : 92) / visibleCards;

  return (
    <Flex
      width="100%"
      height={`${cardHeight}px`}
      gap={{ base: "8px", sm: "14px" }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      <SimpleGrid
        columns={visibleCards}
        position="relative"
        width={visibleCards > 5 ? "97%" : visibleCards > 6 ? "95%" : "100%"}
      >
        {cards.map((card) => {
          const isDiscarded = discardedCards.includes(card.id);
          return (
            <Flex
              className="special-cards-step-1"
              key={card.idx}
              justifyContent="flex-start"
              width={`${slotWidth}%`}
              maxWidth={`${cardWidth + 7}px`}
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
                  scale={specialCardScale - specialCardScale * 0.1}
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
                            console.log(card.idx);
                            setCardToDiscard(card.idx);
                          }}
                        >
                          <Text fontSize="10px">X</Text>
                          {hoveredButton === card.idx && (
                            <Text fontSize="10px">
                              {t(
                                "game.special-cards.remove-special-cards-label"
                              )}
                            </Text>
                          )}
                        </Button>
                      )}
                    </Flex>
                    <Box
                      height={
                        CARD_HEIGHT *
                        (specialCardScale - specialCardScale * 0.1)
                      }
                      width={
                        CARD_WIDTH * (specialCardScale - specialCardScale * 0.1)
                      }
                      onClick={() => {
                        isSmallScreen && highlightCard(card);
                      }}
                    >
                      <CardImage3D card={card} small />
                    </Box>
                  </Box>
                </AnimatedCard>
              )}
            </Flex>
          );
        })}
        {Array.from({ length: freeUnlockedSlots }).map((_, index) => (
          <Flex key={`unlocked-slot-${index}`} maxWidth={`${slotWidth}%`}>
            <UnlockedSlot
              key={`unlocked-${index}`}
              backgroundColor={isRageRound ? "black" : BACKGROUND_BLUE}
              scale={specialCardScale - specialCardScale * 0.1}
            />
          </Flex>
        ))}
        {Array.from({ length: lockedSlots }).map((_, index) => (
          <Flex key={`locked-slot-${index}`} maxWidth={`${slotWidth}%`}>
            <LockedSlot
              key={`locked-${index}`}
              scale={specialCardScale - specialCardScale * 0.1}
              backgroundColor={isRageRound ? "black" : "transparent"}
              borderRadius={isSmallScreen ? "0px" : "10%"}
            />
          </Flex>
        ))}
      </SimpleGrid>
      {cardToDiscard !== null && (
        <ConfirmationModal
          close={() => setCardToDiscard(null)}
          title={t("game.special-cards.confirmation-modal.title")}
          description={t("game.special-cards.confirmation-modal.description")}
          onConfirm={handleDiscard}
        />
      )}
    </Flex>
  );
};
