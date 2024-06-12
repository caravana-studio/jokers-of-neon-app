import { Card } from "../types/Card";
import { getCardData } from "./getCardData";

export const getTooltip = (card: Card) => {
  const { name, description } = getCardData(card);
  if (card.isModifier || card.isSpecial) {
    return description;
  }
  const tooltip = `${name}: ${description}`;
  return tooltip;
};
