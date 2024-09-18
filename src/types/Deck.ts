import { Card } from "./Card";

export interface Deck {
  size: number;
  currentLength: number;
  cards: Card[];
}