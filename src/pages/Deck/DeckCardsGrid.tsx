import { Box, Flex, Heading } from "@chakra-ui/react";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { Card } from "../../types/Card";
import { Suits } from "../../enums/suits";
import { isMobile } from "react-device-detect";
import { sortCards } from "../../utils/sortCards";
import { SortBy } from "../../enums/sortBy";

const SCALE = 0.55;
const CUSTOM_CARD_WIDTH = CARD_WIDTH * SCALE;
const CUSTOM_CARD_HEIGHT = CARD_HEIGHT * SCALE;

interface DeckCardsGridProps {
  cards: Card[] | undefined;
  filters?: DeckCardsFilters;
  usedCards?: Card[];
}

export interface DeckCardsFilters {
  isModifier?: boolean;
  isNeon?: boolean;
  suit?: Suits;
}

export const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({
  cards,
  filters,
  usedCards = [],
}) => {
  console.log(filters);
  const hasFilters =
    filters?.isModifier != undefined ||
    filters?.isNeon != undefined ||
    filters?.suit != undefined;
  const sortedCards = hasFilters
    ? sortCards(cards ?? [], SortBy.RANK)
    : sortCards(cards ?? [], SortBy.SUIT);

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
      <Flex wrap="wrap" position="relative" w="100%" mb={4} overflow="hidden">
        {filteredCards?.map((card, index) => {
          const usedCount = countUsedCards(card);
          const opacity = usedCount > 0 ? 0.6 : 1;
          const borderRadius = isMobile ? "5px" : "8px";
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
              }}
            >
              <TiltCard card={card} scale={SCALE} />
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};
