import { CARDS_RARITY } from "../constants/rarity";
import { Cards } from "../enums/cards";
import { CardTypes } from "../enums/cardTypes";
import { Suits } from "../enums/suits";
import { SpineAnimationInfo } from "./SpineAnimationInfo";

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
    animation?: SpineAnimationInfo;
}

export type CardDataMap = {
    [key: number]: CardData;
  };