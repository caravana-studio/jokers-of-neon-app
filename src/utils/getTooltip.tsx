import { Card } from "../types/Card";
import { getCardData } from "./getCardData";
import { VIOLET, NEON_GREEN } from "../theme/colors";

export const getTooltip = (card: Card, isPack = false) => {
  const { name, description } = getCardData(card, isPack);

  const tooltip = `${name}: ${description}`;

  const colorizeText = (inputText: string) => {
    const parts = inputText.split(/((?:\+\d+\s*(?:points?|multi))+)/g);
    return parts.map((part, index) => {
      if (/^\+\d+\s*points?/.test(part)) {
        return <span key={index} style={{ fontWeight:'bold', color: `${NEON_GREEN}` }}>{part}</span>;
      } else if (/^\+\d+\s*multi/.test(part)) {
        return <span key={index} style={{ fontWeight:'bold', color: `${VIOLET}` }}>{part}</span>;
      }
      return part;
    });
  };

  return <>{colorizeText(card.isModifier || card.isSpecial ? description : tooltip)}</>;
};
