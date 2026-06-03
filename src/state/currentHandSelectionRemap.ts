import { Card } from "../types/Card";

type PreselectedModifiers = { [key: number]: number[] };

type RemapPreselectedStateParams = {
  previousHand: Card[];
  nextHand: Card[];
  preSelectedCards: number[];
  preSelectedModifiers: PreselectedModifiers;
  discardedCardIdx: number;
};

const isValidGameCard = (card: Card) => card.card_id !== 9999;

const getCardFingerprint = (card: Card) =>
  `${card.card_id ?? -1}:${card.isModifier ? "modifier" : "card"}:${card.isSpecial ? "special" : "standard"}`;

const sequencesMatch = (left: Card[], right: Card[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every(
    (card, index) => getCardFingerprint(card) === getCardFingerprint(right[index])
  );
};

const buildCardIdxRemapAfterModifierChange = (
  previousHand: Card[],
  nextHand: Card[],
  discardedCardIdx: number
) => {
  const previousRetainedCards = previousHand.filter(
    (card) => isValidGameCard(card) && card.idx !== discardedCardIdx
  );
  const nextValidCards = nextHand.filter(isValidGameCard);

  if (nextValidCards.length !== previousRetainedCards.length + 1) {
    return null;
  }

  for (let insertedCardIndex = 0; insertedCardIndex < nextValidCards.length; insertedCardIndex += 1) {
    const nextCardsWithoutInserted = nextValidCards.filter(
      (_, index) => index !== insertedCardIndex
    );

    if (!sequencesMatch(previousRetainedCards, nextCardsWithoutInserted)) {
      continue;
    }

    const remap = new Map<number, number>();
    let nextCursor = 0;

    previousRetainedCards.forEach((card) => {
      if (nextCursor === insertedCardIndex) {
        nextCursor += 1;
      }

      remap.set(card.idx, nextValidCards[nextCursor].idx);
      nextCursor += 1;
    });

    return remap;
  }

  return null;
};

export const remapPreselectedStateAfterModifierChange = ({
  previousHand,
  nextHand,
  preSelectedCards,
  preSelectedModifiers,
  discardedCardIdx,
}: RemapPreselectedStateParams) => {
  const cardIdxRemap = buildCardIdxRemapAfterModifierChange(
    previousHand,
    nextHand,
    discardedCardIdx
  );

  if (!cardIdxRemap) {
    return null;
  }

  const nextPreSelectedCards = preSelectedCards.flatMap((cardIdx) => {
    const remappedCardIdx = cardIdxRemap.get(cardIdx);
    return remappedCardIdx === undefined ? [] : [remappedCardIdx];
  });

  const nextPreSelectedModifiers: PreselectedModifiers = {};

  Object.entries(preSelectedModifiers).forEach(([cardIdx, modifierIndexes]) => {
    const remappedCardIdx = cardIdxRemap.get(Number(cardIdx));

    if (remappedCardIdx === undefined) {
      return;
    }

    const remappedModifierIndexes = modifierIndexes.flatMap((modifierIdx) => {
      const remappedModifierIdx = cardIdxRemap.get(modifierIdx);
      return remappedModifierIdx === undefined ? [] : [remappedModifierIdx];
    });

    if (remappedModifierIndexes.length > 0) {
      nextPreSelectedModifiers[remappedCardIdx] = remappedModifierIndexes;
    }
  });

  return {
    nextPreSelectedCards,
    nextPreSelectedModifiers,
  };
};
