import { CardTypes } from "../../enums/cardTypes";

export const getCardTypeFromCardId = (cardId: number) => {
  if (cardId <= 105) {
    return CardTypes.COMMON;
  } else if (cardId >= 106 && cardId <= 117) {
    return CardTypes.MODIFIER;
  } else {
    return CardTypes.SPECIAL;
  }
};
