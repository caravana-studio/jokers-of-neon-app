import { Card } from "./Card";

export interface Deck {
  size: number;
  currentLength: number;
  fullDeckCards: Card[];
  usedCards: Card[];
}