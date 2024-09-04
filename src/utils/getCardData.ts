import { MODIFIER_CARDS_DATA } from "../data/modifiers";
import { PACKS_DATA } from "../data/packs";
import { SPECIAL_CARDS_DATA } from "../data/specialCards";
import { TRADITIONAL_CARDS_DATA } from "../data/traditionalCards";
import { Card } from "../types/Card";
import { CardData } from "../types/CardData";

export const getCardData = (card: Card, isPack: boolean = false): CardData => {
  const cardId = Number(card.card_id);
  if (isPack && cardId in PACKS_DATA) {
    return PACKS_DATA[cardId];
  } else if (card.isSpecial && cardId in SPECIAL_CARDS_DATA) {
    return SPECIAL_CARDS_DATA[cardId];
  } else if (card.isModifier && cardId in MODIFIER_CARDS_DATA) {
    return MODIFIER_CARDS_DATA[cardId];
  } else if (cardId in TRADITIONAL_CARDS_DATA) {
    return TRADITIONAL_CARDS_DATA[cardId];
  } else {
    return {
      name: "",
      description: "",
    };
  }
};
