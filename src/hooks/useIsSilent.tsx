import { rageCardIds } from "../constants/rageCardIds";
import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import { useCardData } from "../providers/CardDataProvider";
import { useGameContext } from "../providers/GameProvider";
import { Card } from "../types/Card";

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

const isFigure = (rank: Cards) => {
  return rank === Cards.JACK || rank === Cards.QUEEN || rank === Cards.KING;
};

const isWeak = (rank: Cards) => {
  return (
    rank === Cards.TWO ||
    rank === Cards.THREE ||
    rank === Cards.FOUR ||
    rank === Cards.FIVE
  );
};

export const useIsSilent = (card: Card) => {
  const { isRageRound, rageCards } = useGameContext();
  const { getCardData } = useCardData();

  const { suit: idSuit, card: rank } = getCardData(card.card_id ?? 0);
  const suit = card.suit ?? idSuit;
  const isSilent = rageCards.some((rageCard) => {
    return (
      getSilentTarget(rageCard.card_id!) === suit ||
      (rageCard.card_id === rageCardIds.BROKEN_FIGURES &&
        isFigure(rank ?? Cards.ACE)) ||
      (rageCard.card_id === rageCardIds.BETRAYING_THE_WEAK &&
        isWeak(rank ?? Cards.ACE))
    );
  });
  return isRageRound && isSilent;
};
