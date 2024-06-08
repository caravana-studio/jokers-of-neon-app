import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import { Effect } from "./Effect";

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
  points?: number;
  card_id?: number;
}

export interface StaticEffectCard extends Effect {
  id: number;
  effect_id: number;
  type_effect_card: string;
  price: number;
  probability: number;
}

export interface StaticCommonCard {
  id: number;
  value: Cards;
  suit: Suits;
  points: number;
  img: string;
}