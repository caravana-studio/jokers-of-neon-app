import i18n from "i18next";
import { RARITY } from "../constants/rarity";
import { CardTypes } from "../enums/cardTypes";

export const MODIFIERS_SUIT_CHANGING = [608, 609, 610, 611];

const CARDS_PRICE: Record<RARITY, number> = {
  [RARITY.B]: 300,
  [RARITY.A]: 750,
  [RARITY.S]: 1000,
  [RARITY.C]: 0,
  [RARITY.SS]: 0,
};

const ns = "effects";

export const getModifierCardData = (id: number) => {
  const rarity = MODIFIERS_KEYS[id];
  const price = CARDS_PRICE[rarity];
  return {
    name: i18n.t(`modifierCardsData.${id}.name`, { ns }),
    description: i18n.t(`modifierCardsData.${id}.description`, { ns }),
    rarity,
    price,
    type: CardTypes.MODIFIER,
  };
};

export const MODIFIERS_KEYS: Record<number, RARITY> = {
  608: RARITY.B,
  609: RARITY.B,
  610: RARITY.B,
  611: RARITY.B,
  612: RARITY.S,
  613: RARITY.A,
};
