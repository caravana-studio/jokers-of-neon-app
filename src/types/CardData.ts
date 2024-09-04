import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";

export interface CardData {
    name: string;
    description: string;
    card?: Cards;
    suit?: Suits;
    details?: string;
}

export type CardDataMap = {
    [key: number]: CardData;
  };