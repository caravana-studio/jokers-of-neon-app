import { CardTypes } from "../../enums/cardTypes";
import { getCardTypeFromCardId } from "./getCardTypeFromCardId";

export const getCardFromCardId = (cardId: number, index: number, skin_id = 0) => {
  const cardType = getCardTypeFromCardId(cardId);
  return {
    isModifier: cardType === CardTypes.MODIFIER,
    isSpecial: cardType === CardTypes.SPECIAL,
    card_id: cardId,
    id: cardId?.toString() ?? "",
    idx: index,
    img: `${cardId}${skin_id !== 0 ? `-sk${skin_id}` : ""}.png`,
  };
};
