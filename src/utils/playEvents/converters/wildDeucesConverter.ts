import { CARDS_SUIT_DATA } from "../../../data/traditionalCards";
import { EventTypeEnum } from "../../../dojo/typescript/custom";
import { Cards } from "../../../enums/cards";
import { Card } from "../../../types/Card";
import { CardPlayEvent, CardPlayEventValue } from "../../../types/ScoreData";
import { changeWildcard } from "../../cardTransformation/changeWildcard";
import {
  BuildOptimisticConverterEventsParams,
  OptimisticConverterBehavior,
} from "./types";

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

export const buildWildDeucesOptimisticEvents = ({
  hand,
  preSelectedCards,
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
  const rankChanges = preSelectedCards.reduce<CardPlayEventValue[]>(
    (acc, cardIdx) => {
      const card = cardsByIdx.get(cardIdx);
      if (!card || card.card_id === undefined) {
        return acc;
      }

      const cardValue = getCardValue(card);
      if (cardValue !== Cards.TWO) {
        return acc;
      }

      const wildcardCardId = changeWildcard(card.card_id);
      if (wildcardCardId === card.card_id) {
        return acc;
      }

      acc.push({ idx: cardIdx, quantity: wildcardCardId });
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

export const wildDeucesOptimisticConverter: OptimisticConverterBehavior = {
  deterministic: true,
  buildEvents: buildWildDeucesOptimisticEvents,
};
