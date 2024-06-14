import {Card} from './Card.ts'

export interface Deck {
  size: number;
  currentLength: number;
  commonCards: Card[];
  effectCards: Card[];
}