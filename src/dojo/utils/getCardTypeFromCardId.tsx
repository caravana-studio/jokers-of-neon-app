import { CardTypes } from "../../enums/cardTypes";

export const getCardTypeFromCardId = (cardId: number) => {
  if (cardId < 300) {
    return CardTypes.COMMON;
  } else if (cardId >= 10000 && cardId < 20000) {
    return CardTypes.SPECIAL;
  } else if (cardId >= 20000 && cardId < 30000) {
    return CardTypes.RAGE;
  } else if (cardId >= 600) {
    return CardTypes.MODIFIER;
  } else {
    return CardTypes.SPECIAL;
  }
};
