import { RARITY } from "../../../constants/rarity";
import { getCardFromCardId } from "../../../dojo/utils/getCardFromCardId";
import { Card } from "../../../types/Card";
import { getCardData } from "../../../utils/getCardData";

export interface DocCardData {
  name: string;
  description: string;
  price?: number;
}

const rarityOrder: Record<RARITY, number> = {
  [RARITY.SS]: 1,
  [RARITY.S]: 2,
  [RARITY.A]: 3,
  [RARITY.B]: 4,
  [RARITY.C]: 5,
};

const getDocCardsData = (cardsId: number[]) => {
  const cards: Card[] = [];

  cardsId.forEach((cardId) => {
    const card: Card = getCardFromCardId(cardId, cardId);
    cards.push(card);
  });

  return cards;
};

export const getSortedDocCardsData = (
  cardsId: number[],
  isPack: boolean = false
): Card[] => {
  const cards: Card[] = getDocCardsData(cardsId);

  return cards.slice().sort((a, b) => {
    const aData = getCardData(a, isPack);
    const bData = getCardData(b, isPack);

    const rarityA =
      aData.rarity && rarityOrder[aData.rarity as RARITY] !== undefined
        ? rarityOrder[aData.rarity as RARITY]
        : Infinity;
    const rarityB =
      bData.rarity && rarityOrder[bData.rarity as RARITY] !== undefined
        ? rarityOrder[bData.rarity as RARITY]
        : Infinity;
    return rarityA - rarityB;
  });
};
