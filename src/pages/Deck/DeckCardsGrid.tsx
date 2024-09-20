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
  }

  export interface DeckCardsFilters {
    isModifier?: boolean;
    isNeon?: boolean;
    suit?: Suits; 
  }

  export const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({ cards, filters }) => {
  console.log(cards);
  const filteredCards = cards?.filter(card => {
    let matchesFilter = true;
    
    if (filters)
    {
      console.log(card.suit + " == " + filters.suit);

      if (filters.isNeon !== undefined) {
        //matchesFilter = matchesFilter && card.isNeon === isNeon;
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

  return (
    <Box mb={4}>
      <Flex wrap="wrap" position="relative" w="100%" mb={4}>
        {filteredCards?.map((card) => (
          <Box
            key={card.id + String(card.isModifier)}
            w={`${CUSTOM_CARD_WIDTH}px`}                                             
            h={`${CUSTOM_CARD_HEIGHT}px`}                                            
            position="relative"                                                      
            mr={`-${CUSTOM_CARD_WIDTH / 5}px`}                                       
            mb={4}                                                                   
          >
            <TiltCard card={card} scale={SCALE} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
  };