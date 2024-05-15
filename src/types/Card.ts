import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";

export interface Card {
  id: string;
  img: string;
  value?: Cards;
  suit?: Suits;
  modifiers?: Card[];
  name?: string;
  isModifier?: boolean;
  isSpecial?: boolean;
  idx: number;
}
