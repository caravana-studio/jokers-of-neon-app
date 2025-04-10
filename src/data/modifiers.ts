import { RARITY } from "../constants/rarity";

export const MODIFIERS_SUIT_CHANGING = [608, 609, 610, 611];

export const MODIFIERS_PRICE: Record<RARITY, number> = {
  [RARITY.B]: 300,
  [RARITY.A]: 750,
  [RARITY.S]: 1000,
  [RARITY.C]: 0,
  [RARITY.SS]: 0,
};

export const MODIFIERS_RARITY: Record<number, RARITY> = {
  608: RARITY.B,
  609: RARITY.B,
  610: RARITY.B,
  611: RARITY.B,
  612: RARITY.S,
  613: RARITY.A,
};
