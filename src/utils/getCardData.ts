import { MODIFIER_CARDS_DATA } from "../data/modifiers";
import { SPECIAL_CARDS_DATA } from "../data/specialCards";
import { TRADITIONAL_CARDS_DATA } from "../data/traditionalCards";
import { Card } from "../types/Card";
import { CardData } from "../types/CardData";

export const getCardData = (card: Card): CardData => {
  const cardId = Number(card.card_id);
  if (card.isSpecial && cardId in SPECIAL_CARDS_DATA) {
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
