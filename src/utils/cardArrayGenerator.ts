import { Card } from "../types/card";

export const cardArrayGenerator = (cards: Card[]) => {
  if (cards.length === 0) {
    return [];
  }
  const arrCards = cards.map((card) => [card.value, card.suit]).flat();
  return [cards.length, ...arrCards];
};
