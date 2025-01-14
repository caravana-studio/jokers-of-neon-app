import { getCardFromCardId } from "../../../dojo/utils/getCardFromCardId";
import { CardDataMap } from "../../../types/CardData";

export interface DocCardData {
  name: string;
  description: string;
  price?: number;
}

export const getDocCardsData = (cardDataMap: CardDataMap) => {
  return Object.keys(cardDataMap).map((key) => {
    const cardId = Number(key);
    const card = getCardFromCardId(cardId, cardId);
    const cardData = cardDataMap[cardId];

    return {
      card,
      cardData,
    };
  });
};
