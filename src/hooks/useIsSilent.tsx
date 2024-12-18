import { rageCardIds } from "../constants/rageCardIds";
import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import { useGameContext } from "../providers/GameProvider";
import { Card } from "../types/Card";
import { getCardData } from "../utils/getCardData";

const getSilentTarget = (cardId: number) => {
  switch (cardId) {
    case 401:
      return Suits.HEARTS;
    case 402:
      return Suits.CLUBS;
    case 403:
      return Suits.DIAMONDS;
    case 404:
      return Suits.SPADES;
    case 405:
      return Suits.JOKER;
    default:
      return "None";
  }
};

const isFigure = (card: Card) => {
  const { card: rank } = getCardData(card, false);
  return rank === Cards.JACK || rank === Cards.QUEEN || rank === Cards.KING;
};

export const useIsSilent = (card: Card) => {
  const { isRageRound, rageCards } = useGameContext();
  const { suit: idSuit } = getCardData(card, false);
  const suit = card.suit ?? idSuit;
  const isSilent = rageCards.some((rageCard) => {
    return (
      getSilentTarget(rageCard.card_id!) === suit ||
      (rageCard.card_id === rageCardIds.BROKEN_FIGURES && isFigure(card))
    );
  });
  return isRageRound && isSilent;
};
