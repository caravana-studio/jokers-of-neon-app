import { PokerHand } from "../dojo/typescript/models.gen";

export interface LevelPokerHand {
  poker_hand: PokerHand;
  level: Number;
  multi: Number;
  points: Number;
}
