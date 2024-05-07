import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";

export interface Card {
  value: Cards;
  suit: Suits;
}
