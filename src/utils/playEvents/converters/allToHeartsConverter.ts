import { CARDS_SUIT_DATA } from "../../../data/traditionalCards";
import { EventTypeEnum } from "../../../dojo/typescript/custom";
import { Cards } from "../../../enums/cards";
import { ModifiersId } from "../../../enums/modifiersId";
import { Suits } from "../../../enums/suits";
import { Card } from "../../../types/Card";
import {
  CardPlayEvent,
  CardPlayEventValue,
} from "../../../types/ScoreData";
import {
  BuildOptimisticConverterEventsParams,
  OptimisticConverterBehavior,
} from "./types";

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

const isJokerOrWildcard = (card: Card): boolean => {
  const suit = getCardSuit(card);
  if (suit === Suits.JOKER || suit === Suits.WILDCARD) {
    return true;
  }

  const value = getCardValue(card);
  return value === Cards.JOKER || value === Cards.WILDCARD;
};

const hasWildcardModifier = (
  cardIdx: number,
  preSelectedModifiers: { [key: number]: number[] },
  cardsByIdx: Map<number, Card>
): boolean => {
  const modifiers = preSelectedModifiers[cardIdx] ?? [];
  return modifiers.some((modifierIdx) => {
    const modifierCard = cardsByIdx.get(modifierIdx);
    return modifierCard?.card_id === ModifiersId.WILDCARD_MODIFIER;
  });
};

export const buildAllToHeartsOptimisticEvents = ({
  hand,
  preSelectedCards,
  preSelectedModifiers,
  specialCard,
}: BuildOptimisticConverterEventsParams): CardPlayEvent[] => {
  if (preSelectedCards.length === 0) {
    return [];
  }

  const specialIdx = specialCard.idx ?? specialCard.card_id;
  if (specialIdx === undefined) {
    return [];
  }

  const cardsByIdx = new Map(hand.map((card) => [card.idx, card]));
  const handCardsToConvert = preSelectedCards.reduce<CardPlayEventValue[]>(
    (acc, cardIdx) => {
      const card = cardsByIdx.get(cardIdx);
      if (!card) {
        return acc;
      }

      if (isJokerOrWildcard(card)) {
        return acc;
      }

      if (hasWildcardModifier(cardIdx, preSelectedModifiers, cardsByIdx)) {
        return acc;
      }

      acc.push({ idx: cardIdx, quantity: 0 });
      return acc;
    },
    []
  );

  if (handCardsToConvert.length === 0) {
    return [];
  }

  return [
    {
      hand: handCardsToConvert,
      specials: [{ idx: specialIdx, quantity: 1 }],
      eventType: EventTypeEnum.Heart,
    },
  ];
};

export const allToHeartsOptimisticConverter: OptimisticConverterBehavior = {
  deterministic: true,
  buildEvents: buildAllToHeartsOptimisticEvents,
};
