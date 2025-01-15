import { CARDS_RARITY } from "../constants/cardsRarity";
import { Cards } from "../enums/cards";
import { CardTypes } from "../enums/cardTypes";
import { Suits } from "../enums/suits";

export interface CardData {
    name: string;
    description: string;
    card?: Cards;
    suit?: Suits;
    details?: string;
    type?: CardTypes
    size?: number;
    rarity?: CARDS_RARITY;
    price?: number;
}

export type CardDataMap = {
    [key: number]: CardData;
  };