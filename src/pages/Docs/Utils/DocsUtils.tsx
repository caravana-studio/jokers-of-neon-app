import { getCardFromCardId } from "../../../dojo/utils/getCardFromCardId";
import { Card } from "../../../types/Card";
import { CardDataMap } from "../../../types/CardData";

export interface DocCardData {
  name: string;
  description: string;
  price?: number;
}

export const getDocCardsData = (cardDataMap: CardDataMap) => {
  return Object.keys(cardDataMap).map((key) => {
    const cardId = Number(key);
    let card: Card = getCardFromCardId(cardId, cardId);

    const cardData = cardDataMap[cardId];
    card = {
      ...card,
      ...cardData,
      price: cardDataMap[cardId].price,
      rarity: cardDataMap[cardId].rarity,
    };

    return card;
  });
};
