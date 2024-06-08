import { Card } from "../types/Card";

export const sortCards = (cards: Card[]): Card[] => {
  return cards.sort((a, b) => {
    // First layer: isModifier and isSpecial
    if (a.isModifier !== b.isModifier) {
      return a.isModifier ? 1 : -1;
    }
    if (a.isSpecial !== b.isSpecial) {
      return a.isSpecial ? 1 : -1;
    }

    // Second layer: card_id
    if (a.card_id !== undefined && b.card_id !== undefined) {
      if (a.card_id !== b.card_id) {
        return a.card_id - b.card_id;
      }
    }

    return 0;
  });
};
