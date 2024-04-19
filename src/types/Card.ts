import { Suits } from "./Suits";

export interface Card {
  suit: Suits;
  value: number;
  img: string;
}

export interface HandCard extends Card {
    preSelected: boolean
}