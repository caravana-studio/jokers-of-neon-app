import { Box, Flex, Heading } from "@chakra-ui/react";
import { TiltCard } from "../../components/TiltCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { Card } from "../../types/Card";

const SCALE = 0.55;
const CUSTOM_CARD_WIDTH = CARD_WIDTH * SCALE;
const CUSTOM_CARD_HEIGHT = CARD_HEIGHT * SCALE;

interface DeckCardsGridProps {
    cards: Card[] | undefined; 
  }

  export const DeckCardsGrid: React.FC<DeckCardsGridProps> = ({ cards }) => {
    return (
      <Box mb={4}>
        <Flex wrap="wrap" position="relative" w="100%" mb={4}>
            {cards?.map((card) => (
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