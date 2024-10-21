import { Cards } from "../enums/cards";
import { LabelCardTypes } from "../enums/cardTypes";
import { Suits } from "../enums/suits";

export interface CardData {
    name: string;
    description: string;
    card?: Cards;
    suit?: Suits;
    details?: string;
    type?: LabelCardTypes
}

export type CardDataMap = {
    [key: number]: CardData;
  };