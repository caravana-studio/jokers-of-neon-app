import { describe, expect, it } from "vitest";
import { Card } from "../types/Card";
import { remapPreselectedStateAfterModifierChange } from "./currentHandSelectionRemap";

const createCard = (idx: number, cardId: number, isModifier = false): Card => ({
  idx,
  id: idx.toString(),
  card_id: cardId,
  img: `${cardId}.png`,
  isModifier,
});

describe("remapPreselectedStateAfterModifierChange", () => {
  it("preserves preselected traditional cards when a modifier is replaced", () => {
    const previousHand = [
      createCard(0, 10),
      createCard(1, 11),
      createCard(2, 600, true),
      createCard(3, 12),
      createCard(4, 601, true),
    ];

    const nextHand = [
      createCard(0, 9),
      createCard(1, 10),
      createCard(2, 11),
      createCard(3, 12),
      createCard(4, 601, true),
    ];

    const remapped = remapPreselectedStateAfterModifierChange({
      previousHand,
      nextHand,
      preSelectedCards: [0, 3],
      preSelectedModifiers: {
        3: [4],
      },
      discardedCardIdx: 2,
    });

    expect(remapped).toEqual({
      nextPreSelectedCards: [1, 3],
      nextPreSelectedModifiers: {
        3: [4],
      },
    });
  });

  it("drops only the discarded modifier reference and keeps the rest mapped", () => {
    const previousHand = [
      createCard(0, 10),
      createCard(1, 11),
      createCard(2, 600, true),
      createCard(3, 601, true),
      createCard(4, 12),
    ];

    const nextHand = [
      createCard(0, 10),
      createCard(1, 11),
      createCard(2, 601, true),
      createCard(3, 12),
      createCard(4, 13),
    ];

    const remapped = remapPreselectedStateAfterModifierChange({
      previousHand,
      nextHand,
      preSelectedCards: [4],
      preSelectedModifiers: {
        4: [2, 3],
      },
      discardedCardIdx: 2,
    });

    expect(remapped).toEqual({
      nextPreSelectedCards: [3],
      nextPreSelectedModifiers: {
        3: [2],
      },
    });
  });
});
