import { TRADITIONAL_CARDS_DATA } from "../data/traditionalCards";
import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import { CardDataMap } from "../types/CardData";

function findKeyByCardAndSuit(
  map: CardDataMap,
  card: Cards,
  suit: Suits
): number | undefined {
  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      const cardData = map[key];
      if (cardData.card === card && cardData.suit === suit) {
        return parseInt(key, 10);
      }
    }
  }
  return undefined;
}

export const changeCardSuit = (card_id: number, newSuit: Suits): number => {
  const { card } = TRADITIONAL_CARDS_DATA[card_id];
  return (
    findKeyByCardAndSuit(TRADITIONAL_CARDS_DATA, card!, newSuit) ?? card_id
  );
};
