import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";

export interface Card {
  id: string;
  img: string;
  preSelected?: boolean;
  value?: Cards;
  suit?: Suits;
  modifiers?: Card[];
  name?: string;
  isModifier?: boolean;
  isSpecial?: boolean;
}
