import { LOOT_BOXES_DATA } from "../data/lootBoxes";
import { getModifierCardData } from "../data/modifiers";
import { RAGE_CARDS_DATA } from "../data/rageCards";
import { getSpecialCardData } from "../data/specialCards";
import {
  NEON_CARDS_DATA,
  TRADITIONAL_CARDS_DATA,
} from "../data/traditionalCards";
import { CardTypes } from "../enums/cardTypes";
import { Card } from "../types/Card";
import { CardData } from "../types/CardData";

export const getCardData = (card: Card, isPack: boolean = false): CardData => {
  const cardId = Number(card.card_id);
  const isRage = cardId > 400 && cardId < 500;

  if (isPack && cardId in LOOT_BOXES_DATA) {
    return { ...LOOT_BOXES_DATA[cardId], type: CardTypes.PACK };
  } else if (isRage && cardId in RAGE_CARDS_DATA) {
    return { ...RAGE_CARDS_DATA[cardId], type: CardTypes.RAGE };
  } else if (card.isSpecial && cardId) {
    return getSpecialCardData(cardId);
  } else if (card.isModifier && cardId) {
    return getModifierCardData(cardId);
  } else if (cardId in TRADITIONAL_CARDS_DATA) {
    return { ...TRADITIONAL_CARDS_DATA[cardId], type: CardTypes.COMMON };
  } else if (cardId in NEON_CARDS_DATA) {
    return { ...NEON_CARDS_DATA[cardId], type: CardTypes.NEON };
  } else {
    return {
      name: "",
      description: "",
      type: CardTypes.NONE,
    };
  }
};
