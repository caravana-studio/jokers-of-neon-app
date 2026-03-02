import { EventTypeEnum } from "../../../dojo/typescript/custom";
import { ModifiersId } from "../../../enums/modifiersId";
import { Card } from "../../../types/Card";
import { CardPlayEvent, CardPlayEventValue } from "../../../types/ScoreData";
import {
  BuildOptimisticConverterEventsParams,
  OptimisticConverterBehavior,
} from "./types";

const isCardEffectivelyNeon = (
  card: Card,
  cardIdx: number,
  preSelectedModifiers: { [key: number]: number[] },
  cardsByIdx: Map<number, Card>
): boolean => {
  const baseIsNeon =
    card.isNeon === true ||
    (card.card_id !== undefined && card.card_id >= 200 && card.card_id < 300);
  if (baseIsNeon) {
    return true;
  }

  const modifiers = preSelectedModifiers[cardIdx] ?? [];
  return modifiers.some((modifierIdx) => {
    const modifierCard = cardsByIdx.get(modifierIdx);
    return modifierCard?.card_id === ModifiersId.NEON_MODIFIER;
  });
};

export const buildNeonSynergyOptimisticEvents = ({
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

  const selectedCards = preSelectedCards
    .map((cardIdx) => ({
      cardIdx,
      card: cardsByIdx.get(cardIdx),
    }))
    .filter((item): item is { cardIdx: number; card: Card } => item.card !== undefined);

  if (selectedCards.length === 0) {
    return [];
  }

  const neonCardIndexes = selectedCards
    .filter(({ card, cardIdx }) =>
      isCardEffectivelyNeon(card, cardIdx, preSelectedModifiers, cardsByIdx)
    )
    .map(({ cardIdx }) => cardIdx);

  const neonCardsCount = neonCardIndexes.length;
  if (neonCardsCount === 0) {
    return [];
  }

  const meetsThreshold = neonCardsCount * 2 >= selectedCards.length;
  if (!meetsThreshold) {
    return [];
  }

  const nonNeonCardsToConvert = selectedCards.reduce<CardPlayEventValue[]>(
    (acc, { cardIdx, card }) => {
      const isNeon = isCardEffectivelyNeon(
        card,
        cardIdx,
        preSelectedModifiers,
        cardsByIdx
      );
      if (!isNeon) {
        acc.push({ idx: cardIdx, quantity: 0 });
      }
      return acc;
    },
    []
  );

  if (nonNeonCardsToConvert.length === 0) {
    return [];
  }

  return [
    {
      hand: nonNeonCardsToConvert,
      specials: [{ idx: specialIdx, quantity: 1 }],
      eventType: EventTypeEnum.Neon,
    },
  ];
};

export const neonSynergyOptimisticConverter: OptimisticConverterBehavior = {
  deterministic: true,
  buildEvents: buildNeonSynergyOptimisticEvents,
};
