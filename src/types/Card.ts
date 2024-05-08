import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";

export interface Card {
  value: Cards;
  suit: Suits;
  img: string;
}

export interface HandCard extends Card {
    preSelected: boolean
}