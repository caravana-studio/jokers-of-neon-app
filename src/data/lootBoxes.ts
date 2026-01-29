import { RARITY } from "../constants/rarity";

export const BOXES_PRICE: Record<RARITY, number> = {
  [RARITY.C]: 750,
  [RARITY.B]: 1500,
  [RARITY.A]: 2000,
  [RARITY.S]: 0,
  [RARITY.SS]: 0,
};

export const BOXES_RARITY: Record<number, { rarity: RARITY; size: number }> = {
  1: { size: 5, rarity: RARITY.C },
  2: { size: 5, rarity: RARITY.B },
  3: { size: 3, rarity: RARITY.B },
  4: { size: 3, rarity: RARITY.A },
  5: { size: 5, rarity: RARITY.B },
  6: { size: 5, rarity: RARITY.C },
  7: { size: 4, rarity: RARITY.A },
  8: { size: 5, rarity: RARITY.B },
  9: { size: 3, rarity: RARITY.C },
  10: { size: 5, rarity: RARITY.A },
  11: { size: 5, rarity: RARITY.B },
  12: { size: 5, rarity: RARITY.B },
  13: { size: 5, rarity: RARITY.B },
};
