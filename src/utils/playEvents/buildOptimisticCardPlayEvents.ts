import { EventTypeEnum } from "../../dojo/typescript/custom";
import { CARDS_SUIT_DATA } from "../../data/traditionalCards";
import { Cards } from "../../enums/cards";
import { ModifiersId } from "../../enums/modifiersId";
import { Card } from "../../types/Card";
import { CardPlayEvent } from "../../types/ScoreData";
import { checkHand } from "../checkHand";

interface BuildOptimisticCardPlayEventsParams {
  hand: Card[];
  preSelectedCards: number[];
  specialCards: Card[];
  preSelectedModifiers: { [key: number]: number[] };
  silentCardIndexes?: Set<number>;
}

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

  return CARDS_SUIT_DATA[card.card_id]?.card;
};

const getCardBasePoints = (cardValue?: Cards): number => {
  if (cardValue === undefined) {
    return 0;
  }

  if (cardValue >= Cards.TWO && cardValue <= Cards.TEN) {
    return cardValue;
  }

  if (
    cardValue === Cards.JACK ||
    cardValue === Cards.QUEEN ||
    cardValue === Cards.KING
  ) {
    return 10;
  }

  if (cardValue === Cards.ACE) {
    return 11;
  }

  if (cardValue === Cards.JOKER) {
    return 100;
  }

  return 0;
};

const cardIsNeon = (
  card: Card,
  preSelectedModifiers: { [key: number]: number[] },
  cardsByIdx: Map<number, Card>
) => {
  if (card.isNeon) {
    return true;
  }

  if (
    card.card_id !== undefined &&
    card.card_id >= 200 &&
    card.card_id < 300
  ) {
    return true;
  }

  const modifiers = preSelectedModifiers[card.idx] ?? [];
  return modifiers.some((modifierIdx) => {
    const modifierCard = cardsByIdx.get(modifierIdx);
    return modifierCard?.card_id === ModifiersId.NEON_MODIFIER;
  });
};

const cardHasWildcardModifier = (
  card: Card,
  preSelectedModifiers: { [key: number]: number[] },
  cardsByIdx: Map<number, Card>
) => {
  const modifiers = preSelectedModifiers[card.idx] ?? [];
  return modifiers.some((modifierIdx) => {
    const modifierCard = cardsByIdx.get(modifierIdx);
    return modifierCard?.card_id === ModifiersId.WILDCARD_MODIFIER;
  });
};

export const buildOptimisticCardPlayEvents = ({
  hand,
  preSelectedCards,
  specialCards,
  preSelectedModifiers,
  silentCardIndexes,
}: BuildOptimisticCardPlayEventsParams): CardPlayEvent[] => {
  if (preSelectedCards.length === 0) {
    return [];
  }

  const handResult = checkHand(
    hand,
    preSelectedCards,
    specialCards,
    preSelectedModifiers
  );
  const cardsByIdx = new Map(hand.map((card) => [card.idx, card]));
  const preselectedOrderByIdx = new Map(
    preSelectedCards.map((cardIdx, position) => [cardIdx, position])
  );

  const pointEvents: CardPlayEvent[] = [];
  const multiEvents: CardPlayEvent[] = [];

  const orderedCardsComposingPlay = [...handResult.cardsComposingPlay].sort(
    (a, b) =>
      (preselectedOrderByIdx.get(a) ?? Number.MAX_SAFE_INTEGER) -
      (preselectedOrderByIdx.get(b) ?? Number.MAX_SAFE_INTEGER)
  );

  orderedCardsComposingPlay.forEach((cardIdx) => {
    const card = cardsByIdx.get(cardIdx);
    if (!card) {
      return;
    }

    const isSilent = silentCardIndexes?.has(cardIdx) ?? false;
    const hasSilentFlag =
      (card as Card & { isSilent?: boolean }).isSilent === true;
    if (isSilent || hasSilentFlag) {
      return;
    }

    if (cardHasWildcardModifier(card, preSelectedModifiers, cardsByIdx)) {
      return;
    }

    const isNeon = cardIsNeon(card, preSelectedModifiers, cardsByIdx);
    const cardValue = getCardValue(card);
    const basePoints = getCardBasePoints(cardValue);
    const points = isNeon ? basePoints * 2 : basePoints;

    let multi = 0;
    if (cardValue === Cards.JOKER) {
      multi = isNeon ? 2 : 1;
    } else if (isNeon && basePoints > 0) {
      multi = 1;
    }

    if (points > 0) {
      pointEvents.push({
        hand: [{ idx: cardIdx, quantity: points }],
        specials: [],
        eventType: EventTypeEnum.Point,
      });
    }

    if (multi !== 0) {
      multiEvents.push({
        hand: [{ idx: cardIdx, quantity: multi }],
        specials: [],
        eventType: EventTypeEnum.Multi,
      });
    }
  });

  return [...pointEvents, ...multiEvents];
};
