import { TRADITIONAL_CARDS_DATA } from "../data/traditionalCards";
import { SortBy } from "../enums/sortBy";
import { Card } from "../types/Card";

export const sortCards = (cards: Card[], sortBy: SortBy): Card[] => {
  return cards.sort((a, b) => {
    // First layer: isModifier and isSpecial
    if (a.isModifier !== b.isModifier) {
      return a.isModifier ? 1 : -1;
    }
    if (a.isSpecial !== b.isSpecial) {
      return a.isSpecial ? 1 : -1;
    }

    // Determine rank and suit for both cards
    const cardA = TRADITIONAL_CARDS_DATA[(a.card_id ?? 0) % 200];
    const cardB = TRADITIONAL_CARDS_DATA[(b.card_id ?? 0) % 200];

    if (cardA && cardB) {
      // Second layer: Sort by rank if sortBy is RANK
      if (sortBy === SortBy.RANK) {
        if (cardA.card !== cardB.card) {
          return (cardA.card ?? 0) - (cardB.card ?? 0);
        }
      }

      // Third layer: Sort by suit, then rank if sortBy is SUIT
      if (sortBy === SortBy.SUIT) {
        if (cardA.suit !== cardB.suit) {
          return (cardA.suit ?? 0) - (cardB.suit ?? 0);
        }
        if (cardA.card !== cardB.card) {
          return (cardA.card ?? 0) - (cardB.card ?? 0);
        }
      }
    }

    // Fallback: Preserve original order if all else is equal
    return 0;
  });
};
