import { specialCardIds } from "../../../constants/specialCardIds";
import { CARDS_SUIT_DATA } from "../../../data/traditionalCards";
import { EventTypeEnum } from "../../../dojo/typescript/custom";
import { Cards } from "../../../enums/cards";
import { ModifiersId } from "../../../enums/modifiersId";
import { Plays } from "../../../enums/plays";
import { Suits } from "../../../enums/suits";
import { Card } from "../../../types/Card";
import {
  CardPlayEvent,
  CardPlayEventValue,
} from "../../../types/ScoreData";
import { checkHand } from "../../checkHand";
import {
  BuildOptimisticConverterEventsParams,
  OptimisticConverterBehavior,
} from "./types";

const HIGH_STRAIGHT_RANKS = [
  Cards.TEN,
  Cards.JACK,
  Cards.QUEEN,
  Cards.KING,
  Cards.ACE,
] as const;

const SUIT_BY_MODIFIER: Partial<Record<ModifiersId, Suits>> = {
  [ModifiersId.SUIT_CLUB_MODIFIER]: Suits.CLUBS,
  [ModifiersId.SUIT_DIAMONDS_MODIFIER]: Suits.DIAMONDS,
  [ModifiersId.SUIT_HEARTS_MODIFIER]: Suits.HEARTS,
  [ModifiersId.SUIT_SPADES_MODIFIER]: Suits.SPADES,
  [ModifiersId.WILDCARD_MODIFIER]: Suits.WILDCARD,
};

const getCardSuit = (card: Card): Suits | undefined => {
  if (card.suit !== undefined) {
    return card.suit;
  }

  if (card.card_id === undefined) {
    return undefined;
  }

  return (
    CARDS_SUIT_DATA[card.card_id]?.suit ??
    CARDS_SUIT_DATA[card.card_id % 200]?.suit
  );
};

const getCardValue = (card: Card): Cards | undefined => {
  if (card.value !== undefined) {
    return card.value;
  }

  if (card.card !== undefined) {
    return card.card;
  }

  if (card.card_id === undefined) {
    return undefined;
  }

  return (
    CARDS_SUIT_DATA[card.card_id]?.card ??
    CARDS_SUIT_DATA[card.card_id % 200]?.card
  );
};

const findCardIdByRankSuitAndNeon = (
  rank: Cards,
  suit: Suits,
  isNeon: boolean
): number | undefined => {
  for (const [rawCardId, cardData] of Object.entries(CARDS_SUIT_DATA)) {
    const cardId = Number(rawCardId);
    if (
      cardData.card === rank &&
      cardData.suit === suit &&
      ((isNeon && cardId >= 200 && cardId < 300) ||
        (!isNeon && cardId < 200))
    ) {
      return cardId;
    }
  }

  return undefined;
};

interface EffectiveCardState {
  suit?: Suits;
  value?: Cards;
  isNeon: boolean;
}

const getEffectiveCardStateForRankConverter = ({
  card,
  modifierCards,
  hasActiveAllToHearts,
}: {
  card: Card;
  modifierCards: Card[];
  hasActiveAllToHearts: boolean;
}): EffectiveCardState => {
  let suit = getCardSuit(card);
  let value = getCardValue(card);
  let isNeon =
    card.isNeon === true ||
    (card.card_id !== undefined && card.card_id >= 200 && card.card_id < 300);

  modifierCards.forEach((modifierCard) => {
    const modifierId = modifierCard.card_id as ModifiersId | undefined;
    if (modifierId === undefined) {
      return;
    }

    if (modifierId === ModifiersId.NEON_MODIFIER) {
      isNeon = true;
      return;
    }

    if (modifierId === ModifiersId.WILDCARD_MODIFIER) {
      suit = Suits.WILDCARD;
      value = Cards.WILDCARD;
      return;
    }

    const modifierSuit = SUIT_BY_MODIFIER[modifierId];
    if (modifierSuit !== undefined && suit !== Suits.JOKER) {
      suit = modifierSuit;
    }
  });

  if (
    hasActiveAllToHearts &&
    suit !== Suits.JOKER &&
    suit !== Suits.WILDCARD
  ) {
    suit = Suits.HEARTS;
  }

  return { suit, value, isNeon };
};

const isStraightKindPlay = (play: Plays): boolean =>
  play === Plays.STRAIGHT || play === Plays.STRAIGHT_FLUSH;

export const buildStraightToHighStraightOptimisticEvents = ({
  hand,
  preSelectedCards,
  preSelectedModifiers,
  specialCard,
  specialCards,
}: BuildOptimisticConverterEventsParams): CardPlayEvent[] => {
  if (preSelectedCards.length === 0) {
    return [];
  }

  const specialIdx = specialCard.idx ?? specialCard.card_id;
  if (specialIdx === undefined) {
    return [];
  }

  const specialCardsWithoutCurrent = specialCards.filter(
    (card) => card.idx !== specialCard.idx
  );
  const handResult = checkHand(
    hand,
    preSelectedCards,
    specialCardsWithoutCurrent,
    preSelectedModifiers
  );

  if (!isStraightKindPlay(handResult.play)) {
    return [];
  }

  const cardsByIdx = new Map(hand.map((card) => [card.idx, card]));
  const preselectedOrderByIdx = new Map(
    preSelectedCards.map((cardIdx, position) => [cardIdx, position])
  );

  const orderedCardsComposingPlay = [...handResult.cardsComposingPlay].sort(
    (a, b) =>
      (preselectedOrderByIdx.get(a) ?? Number.MAX_SAFE_INTEGER) -
      (preselectedOrderByIdx.get(b) ?? Number.MAX_SAFE_INTEGER)
  );

  const hasActiveAllToHearts = specialCards.some(
    (card) =>
      card.card_id === specialCardIds.ALL_TO_HEARTS && card.silenced !== true
  );

  const rankChanges = orderedCardsComposingPlay.reduce<CardPlayEventValue[]>(
    (acc, cardIdx, position) => {
      const targetRank = HIGH_STRAIGHT_RANKS[position];
      if (targetRank === undefined) {
        return acc;
      }

      const card = cardsByIdx.get(cardIdx);
      if (!card) {
        return acc;
      }

      const modifierCards = (preSelectedModifiers[cardIdx] ?? [])
        .map((modifierIdx) => cardsByIdx.get(modifierIdx))
        .filter((modifierCard): modifierCard is Card => modifierCard !== undefined);

      const { suit, value, isNeon } = getEffectiveCardStateForRankConverter({
        card,
        modifierCards,
        hasActiveAllToHearts,
      });

      if (
        suit === undefined ||
        value === undefined ||
        suit === Suits.JOKER ||
        suit === Suits.WILDCARD ||
        value === Cards.JOKER ||
        value === Cards.WILDCARD
      ) {
        return acc;
      }

      const currentCardId = findCardIdByRankSuitAndNeon(value, suit, isNeon);
      const targetCardId = findCardIdByRankSuitAndNeon(targetRank, suit, isNeon);
      if (targetCardId === undefined || targetCardId === currentCardId) {
        return acc;
      }

      acc.push({ idx: cardIdx, quantity: targetCardId });
      return acc;
    },
    []
  );

  if (rankChanges.length === 0) {
    return [];
  }

  return [
    {
      hand: rankChanges,
      specials: [{ idx: specialIdx, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ];
};

export const straightToHighStraightOptimisticConverter: OptimisticConverterBehavior =
  {
    deterministic: true,
    buildEvents: buildStraightToHighStraightOptimisticEvents,
  };
