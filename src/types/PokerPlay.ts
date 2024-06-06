import { Hand } from './Hand.ts'

export interface PokerPlay {
  pokerHand: Hand;
  level: number;
  multi: number;
  points: number;
}
