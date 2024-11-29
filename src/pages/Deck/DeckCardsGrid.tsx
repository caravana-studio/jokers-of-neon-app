import { Box, Flex, Heading } from "@chakra-ui/react";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { Card } from "../../types/Card";
import { isMobile } from "react-device-detect";
import { sortCards } from "../../utils/sortCards";
import { SortBy } from "../../enums/sortBy";
import { DeckFiltersState } from "../../types/DeckFilters";
import { useState } from "react";
import { BLUE, BLUE_LIGHT } from "../../theme/colors";

const SCALE = 0.55;
const CUSTOM_CARD_WIDTH = CARD_WIDTH * SCALE;
const CUSTOM_CARD_HEIGHT = CARD_HEIGHT * SCALE;

interface DeckCardsGridProps {
  cards: Card[] | undefined;
  filters?: DeckFiltersState;
  usedCards?: Card[];
  onCardSelect?: (card: Card) => void;
}

export const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({
  cards,
  filters,
  usedCards = [],
  onCardSelect,
}) => {
  const hasFilters =
    filters?.isModifier != undefined ||
    filters?.isNeon != undefined ||
    filters?.suit != undefined;
  const sortedCards = hasFilters
    ? sortCards(cards ?? [], SortBy.RANK)
    : sortCards(cards ?? [], SortBy.SUIT);

  const [selectedCard, setSelectedCard] = useState<Card>();

  const filteredCards = sortedCards?.filter((card) => {
    let matchesFilter = true;

    if (filters) {
      if (filters.isNeon !== undefined) {
        matchesFilter = matchesFilter && card.isNeon === filters.isNeon;
      }

      if (filters.isModifier !== undefined) {
        matchesFilter = matchesFilter && card.isModifier === filters.isModifier;
      }

      if (filters.suit !== undefined) {
        matchesFilter = matchesFilter && card.suit === filters.suit;
      }
    }

    return matchesFilter;
  });

  const countUsedCards = (card: Card): number => {
    return usedCards.filter((usedCard) => usedCard.id === card.id).length;
  };

  return (
    <Box mb={4} overflow="hidden">
      <Flex
        wrap="wrap"
        position="relative"
        w="100%"
        mb={4}
        overflow="hidden"
        justifyContent="center"
        pr={`${CUSTOM_CARD_WIDTH / 2}px`}
      >
        {filteredCards?.map((card, index) => {
          const usedCount = countUsedCards(card);
          const opacity = usedCount > 0 ? 0.6 : 1;
          const borderRadius = isMobile ? "5px" : "8px";
          const isSelected = selectedCard?.id === card.id;

          return (
            <Box
              key={`${card.id}-${index}`}
              w={`${CUSTOM_CARD_WIDTH}px`}
              h={`${CUSTOM_CARD_HEIGHT}px`}
              position="relative"
              mr={`-${CUSTOM_CARD_WIDTH / 5}px`}
              mb={4}
              sx={{
                "& div": {
                  background: "rgba(0,0,0,1)",
                  borderRadius: `${borderRadius}`,
                },
                "& img": {
                  opacity: `${opacity}`,
                },
                boxShadow: isSelected ? `0px 0px 15px 12px ${BLUE}` : "none",
                border: isSelected
                  ? `2px solid ${BLUE_LIGHT}`
                  : "2px solid transparent",
              }}
            >
              <TiltCard
                card={card}
                scale={SCALE}
                onClick={() => {
                  if (selectedCard?.id === card.id) {
                    setSelectedCard(undefined);
                  } else {
                    setSelectedCard(card);
                  }
                  onCardSelect?.(card);
                }}
              />
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};
