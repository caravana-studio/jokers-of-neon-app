import { BLUE_LIGHT, VIOLET_LIGHT } from "../theme/colors";
import { Card } from "../types/Card";
import { getCardData } from "./getCardData";

export const colorizeText = (inputText: string) => {
  const parts = inputText.split(/((?:\+\d+\s*(?:points?|multi))+)/g);
  return parts.map((part, index) => {
    if (/^\+\d+\s*points?/.test(part)) {
      return (
        <span
          key={index}
          style={{ fontWeight: "bold", color: `${BLUE_LIGHT}` }}
        >
          {part}
        </span>
      );
    } else if (/^\+\d+\s*multi/.test(part)) {
      return (
        <span
          key={index}
          style={{ fontWeight: "bold", color: `${VIOLET_LIGHT}` }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

export const getTooltip = (card: Card, isPack = false) => {
  const { name, description } = getCardData(card, isPack);
  const tooltip = `${name}: ${description}`;
  return (
    <>
      {colorizeText(card.isModifier || card.isSpecial ? description : tooltip)}
    </>
  );
};
