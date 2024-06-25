import { Card } from "../types/Card";
import { getCardData } from "./getCardData";
import { Box, Text } from '@chakra-ui/react';
import { getTemporalCardText } from './getTemporalCardText.ts'

export const getTooltip = (card: Card) => {
  const { name, description } = getCardData(card);

  const tooltip = `${name}: ${description}`;

  return (
    <Text>
      { card.isModifier || card.isSpecial ? description : tooltip}
      { card.temporary && (
        <Box>
          <br/>
          <Text>
            {getTemporalCardText(card.remaining)}
          </Text>
        </Box>
    )}
    </Text>
  );
};
