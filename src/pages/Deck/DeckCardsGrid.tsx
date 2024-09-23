import { Box, Flex, Heading } from "@chakra-ui/react";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { Card } from "../../types/Card";
import { Suits } from "../../enums/suits";

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

  export const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({ cards, filters, usedCards = [] }) => {
  const filteredCards = cards?.filter(card => {
    let matchesFilter = true;
    
    if (filters)
    {
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
    return usedCards.filter(
      usedCard => usedCard.id === card.id
    ).length;
  };

  return (
    <Box mb={4}>
      <Flex wrap="wrap" position="relative" w="100%" mb={4}>
        {filteredCards?.map((card, index) => {
          const usedCount = countUsedCards(card);
          const opacity = usedCount > 0 ? 0.6 : 1;
          return (
            <Box
              key={`${card.id}-${index}`}
              w={`${CUSTOM_CARD_WIDTH}px`}
              h={`${CUSTOM_CARD_HEIGHT}px`}
              position="relative"
              mr={`-${CUSTOM_CARD_WIDTH / 5}px`}
              mb={4}
              sx={{
                '& div': {
                  background: 'rgba(0,0,0,1)',
                  borderRadius: '8px',
                },
                '& img': {
                  opacity: `${opacity}`,
                },
              }}
            >
              <TiltCard card={card} scale={SCALE}/>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
  };