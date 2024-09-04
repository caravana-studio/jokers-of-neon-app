import { Card } from "../types/Card";
import { getCardData } from "./getCardData";
import { Text } from '@chakra-ui/react';

export const getTooltip = (card: Card, isPack = false) => {
  const { name, description } = getCardData(card, isPack);

  const tooltip = `${name}: ${description}`;

  return (
    <Text>
      { card.isModifier || card.isSpecial ? description : tooltip}
    </Text>
  );
};
