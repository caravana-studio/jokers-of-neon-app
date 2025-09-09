export enum PokerHandEnum {
  RoyalFlush = "RoyalFlush",
  StraightFlush = "StraightFlush",
  FiveOfAKind = "FiveOfAKind",
  FourOfAKind = "FourOfAKind",
  FullHouse = "FullHouse",
  Straight = "Straight",
  Flush = "Flush",
  ThreeOfAKind = "ThreeOfAKind",
  TwoPair = "TwoPair",
  OnePair = "OnePair",
  HighCard = "HighCard",
}

export type PokerHand = PokerHandEnum;

export interface LevelPokerHand {
  poker_hand: PokerHand;
  level: Number;
  multi: Number;
  points: Number;
}
