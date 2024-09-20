import { useRageCards } from "../dojo/queries/useRageRound";
import { Suits } from "../enums/suits";
import { Card } from "../types/Card";
import { getCardData } from "../utils/getCardData";

const getSilentSuit = (cardId: number) => {
  switch (cardId) {
    case 401:
      return Suits.HEARTS;
    case 402:
      return Suits.CLUBS;
    case 403:
      return Suits.DIAMONDS;
    case 404:
      return Suits.SPADES;
    case 407:
      return Suits.JOKER;
    default:
      return "None";
  }
};

export const useIsSilent = (card: Card) => {
  const { suit } = getCardData(card, false);
  const rageCards = useRageCards();
  const isSilent = rageCards.some((rageCard) => {
    return getSilentSuit(rageCard.card_id) === suit;
  });
  return isSilent;
};
