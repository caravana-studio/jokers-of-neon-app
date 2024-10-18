import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { MAX_SPECIAL_CARDS } from "../constants/config.ts";
import {
  CARD_HEIGHT,
  CARD_WIDTH
} from "../constants/visualProps.ts";
import { useGame } from "../dojo/queries/useGame.tsx";
import { useGameContext } from "../providers/GameProvider.tsx";
import { Card } from "../types/Card.ts";
import { AnimatedCard } from "./AnimatedCard.tsx";
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { LockedSlot } from "./LockedSlot.tsx";
import { TiltCard } from "./TiltCard.tsx";
import { FilledUnlockedSlot } from "./UnlockedSlot.tsx";

interface SpecialCardsRowProps {
  cards: Card[];
}

export const SpecialCardsRow = ({ cards }: SpecialCardsRowProps) => {
  const [discardedCards, setDiscardedCards] = useState<string[]>([]);
  const { discardSpecialCard, roundRewards } = useGameContext();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [cardToDiscard, setCardToDiscard] = useState<number | null>(null);
  const { t } = useTranslation(["game"]);

  const game = useGame();
  const unlockedSpecialSlots = game?.len_max_current_special_cards ?? 1;

  const freeUnlockedSlots = unlockedSpecialSlots - cards.length;
  const lockedSlots =
    unlockedSpecialSlots === MAX_SPECIAL_CARDS
      ? 0
      : Math.max(1, 5 - unlockedSpecialSlots);

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

  const slotWidth = (visibleCards > 6 ? 85 : 90) / visibleCards;

  return (
    <Flex width="100%" height={`${CARD_HEIGHT + 8}px`} gap={3}>
      {cards.map((card) => {
        const isDiscarded = discardedCards.includes(card.id);
        return (
          <Flex
            className="special-cards-step-1"
            key={card.idx}
            justifyContent="center"
            width={`${slotWidth}%`}
            maxWidth={`${CARD_WIDTH + 7}px`}
            position="relative"
            zIndex={1}
            onMouseEnter={() => setHoveredCard(card.idx)}
            onMouseLeave={() => {
              setHoveredCard(null);
              setHoveredButton(null);
            }}
          >
            {!isDiscarded && (
              <AnimatedCard idx={card.idx} isSpecial={!!card.isSpecial}>
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
                        size={isMobile ? "xs" : "md"}
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
                            {t("game.special-cards.remove-special-cards-label")}
                          </Text>
                        )}
                      </Button>
                    )}
                  </Flex>
                  <TiltCard card={card} />
                </Box>
              </AnimatedCard>
            )}
          </Flex>
        );
      })}
      {Array.from({ length: freeUnlockedSlots }).map((_, index) => (
        <Flex width={`${slotWidth}%`}>
          <FilledUnlockedSlot key={`unlocked-${index}`} />
        </Flex>
      ))}
      {Array.from({ length: lockedSlots }).map((_, index) => (
        <Flex width={`${slotWidth}%`}>
          <LockedSlot key={`locked-${index}`} />
        </Flex>
      ))}
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
