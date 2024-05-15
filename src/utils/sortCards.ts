import { Card } from "../types/Card";

export const sortCards = (cards: Card[]): Card[] => {
  return cards.sort((a, b) => {
    if (a.value === b.value) {
      return a.suit! - b.suit!;
    }
    return a.value! - b.value!;
  });
};
