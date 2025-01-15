import { CARDS_RARITY } from "../../../constants/cardsRarity";
import { getCardFromCardId } from "../../../dojo/utils/getCardFromCardId";
import { Card } from "../../../types/Card";
import { CardDataMap } from "../../../types/CardData";

export interface DocCardData {
  name: string;
  description: string;
  price?: number;
}

const rarityOrder: Record<CARDS_RARITY, number> = {
  [CARDS_RARITY.SS]: 1,
  [CARDS_RARITY.S]: 2,
  [CARDS_RARITY.A]: 3,
  [CARDS_RARITY.B]: 4,
  [CARDS_RARITY.C]: 5,
};

const getDocCardsData = (cardDataMap: CardDataMap) => {
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

export const getSortedDocCardsData = (cardDataMap: CardDataMap): Card[] => {
  const cards: Card[] = getDocCardsData(cardDataMap);

  return cards.slice().sort((a, b) => {
    const rarityA = a.rarity ? rarityOrder[a.rarity] : Infinity;
    const rarityB = b.rarity ? rarityOrder[b.rarity] : Infinity;
    return rarityA - rarityB;
  });
};
