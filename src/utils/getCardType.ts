import { CardItemType } from "../dojo/typescript/models.gen";
import { Card } from "../types/Card";

export const getCardType = (card: Card): CardItemType => {
  if (card.isModifier) {
    return { type: "Modifier" };
  } else if (card.isSpecial) {
    return { type: "Special" };
  } else {
    return { type: "Common" };
  }
};
