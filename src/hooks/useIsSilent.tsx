import { rageCardIds } from "../constants/rageCardIds";
import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import { useCardData } from "../providers/CardDataProvider";
import { useGameStore } from "../state/useGameStore";
import { Card } from "../types/Card";

const getSilentTarget = (cardId: number) => {
  switch (cardId) {
    case 20001:
      return Suits.HEARTS;
    case 20002:
      return Suits.CLUBS;
    case 20003:
      return Suits.DIAMONDS;
    case 20004:
      return Suits.SPADES;
    case 20005:
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
  const { isRageRound, rageCards } = useGameStore();
  const { getCardData } = useCardData();

  const { suit: idSuit, card: rank } = getCardData(card.card_id ?? 0);
  const suit = card.suit ?? idSuit;

  if (
    card.isModifier &&
    rageCards.some(
      (rageCard) => rageCard.card_id === rageCardIds.BROKEN_MODIFIERS
    )
  )
    return true;

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

export const isModifierSilent = (card: Card, rageCards: Card[]) => {
  return (
    card.isModifier &&
    rageCards.some(
      (rageCard) => rageCard.card_id === rageCardIds.BROKEN_MODIFIERS
    )
  );
};
