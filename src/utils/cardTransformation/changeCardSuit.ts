import {
  CardMultiSuitDataMap,
  CARDS_SUIT_DATA,
} from "../../data/traditionalCards";
import { Cards } from "../../enums/cards";
import { Suits } from "../../enums/suits";

function findKeyByCardAndSuit(
  map: CardMultiSuitDataMap,
  card: Cards,
  suit: Suits,
  isNeon: boolean
): number | undefined {
  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      const cardData = map[key];
      const keyNumber = parseInt(key, 10);
      if (
        cardData.card === card &&
        cardData.suit === suit &&
        ((isNeon && keyNumber >= 200) || (!isNeon && keyNumber < 200))
      ) {
        return keyNumber;
      }
    }
  }
  return undefined;
}

export const changeCardSuit = (card_id: number, newSuit: Suits): number => {
  const isNeon = card_id >= 200;

  const { card } = CARDS_SUIT_DATA[card_id];

  return (
    findKeyByCardAndSuit(CARDS_SUIT_DATA, card!, newSuit, isNeon) ?? card_id
  );
};
