import { rageCardIds } from "../constants/rageCardIds";
import { CARDS_SUIT_DATA } from "../data/traditionalCards";
import { Cards } from "../enums/cards";
import { Suits } from "../enums/suits";
import { Card } from "../types/Card";

const SILENT_SUIT_BY_RAGE_CARD_ID: Partial<Record<number, Suits>> = {
  20001: Suits.HEARTS,
  20002: Suits.CLUBS,
  20003: Suits.DIAMONDS,
  20004: Suits.SPADES,
  20005: Suits.JOKER,
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

const getCardRank = (card: Card): Cards | undefined => {
  if (card.value !== undefined) {
    return card.value;
  }

  if (card.card !== undefined) {
    return card.card;
  }

  if (card.card_id === undefined) {
    return undefined;
  }

  return CARDS_SUIT_DATA[card.card_id]?.card;
};

const getCardSuit = (card: Card): Suits | undefined => {
  if (card.suit !== undefined) {
    return card.suit;
  }

  if (card.card_id === undefined) {
    return undefined;
  }

  return CARDS_SUIT_DATA[card.card_id]?.suit;
};

export const isCardSilent = (card: Card, rageCards: Card[]): boolean => {
  if ((card as Card & { isSilent?: boolean }).isSilent === true) {
    return true;
  }

  const rageCardIdsSet = new Set(
    rageCards.map((rageCard) => rageCard.card_id).filter((id): id is number => id !== undefined)
  );

  if (card.isModifier && rageCardIdsSet.has(rageCardIds.BROKEN_MODIFIERS)) {
    return true;
  }

  const rank = getCardRank(card);
  const suit = getCardSuit(card);

  const silentBySuit =
    suit !== undefined &&
    [...rageCardIdsSet].some((rageCardId) => SILENT_SUIT_BY_RAGE_CARD_ID[rageCardId] === suit);

  const silentByFigure =
    rank !== undefined &&
    rageCardIdsSet.has(rageCardIds.BROKEN_FIGURES) &&
    isFigure(rank);

  const silentByWeak =
    rank !== undefined &&
    rageCardIdsSet.has(rageCardIds.BETRAYING_THE_WEAK) &&
    isWeak(rank);

  return silentBySuit || silentByFigure || silentByWeak;
};

