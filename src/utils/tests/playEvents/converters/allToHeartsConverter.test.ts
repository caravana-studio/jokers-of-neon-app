import { expect, test } from "vitest";
import { EventTypeEnum } from "../../../../dojo/typescript/custom";
import { ModifiersId } from "../../../../enums/modifiersId";
import { Cards } from "../../../../enums/cards";
import { Suits } from "../../../../enums/suits";
import { Card } from "../../../../types/Card";
import { buildAllToHeartsOptimisticEvents } from "../../../playEvents/converters/allToHeartsConverter";
import { C9, D7, H7, JOKER1 } from "../../../mocks/cardMocks";

test("buildAllToHeartsOptimisticEvents converts all preselected non joker/non wildcard cards", () => {
  const wildcardModifier: Card = {
    id: "613-1",
    img: "613.png",
    idx: 4,
    card_id: ModifiersId.WILDCARD_MODIFIER,
    isModifier: true,
  };
  const hand: Card[] = [
    { ...H7, idx: 0, id: `${H7.id}-0` },
    { ...D7, idx: 1, id: `${D7.id}-1` },
    { ...JOKER1, idx: 2, id: `${JOKER1.id}-2` },
    { ...C9, idx: 3, id: `${C9.id}-3` },
    wildcardModifier,
  ];

  const events = buildAllToHeartsOptimisticEvents({
    hand,
    preSelectedCards: [0, 1, 2, 3],
    specialCards: [],
    preSelectedModifiers: {
      3: [4],
    },
    specialCard: {
      id: "10014",
      img: "10014.png",
      idx: 10014,
      card_id: 10014,
      isSpecial: true,
    },
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: 0, quantity: 0 },
        { idx: 1, quantity: 0 },
      ],
      specials: [{ idx: 10014, quantity: 1 }],
      eventType: EventTypeEnum.Heart,
    },
  ]);
});

test("buildAllToHeartsOptimisticEvents returns empty when all preselected cards are joker/wildcard", () => {
  const wildcardCard: Card = {
    ...C9,
    idx: 9,
    id: `${C9.id}-wild`,
    suit: Suits.WILDCARD,
    card: Cards.WILDCARD,
    value: Cards.WILDCARD,
  };

  const events = buildAllToHeartsOptimisticEvents({
    hand: [JOKER1, wildcardCard],
    preSelectedCards: [JOKER1.idx, wildcardCard.idx],
    specialCards: [],
    preSelectedModifiers: {},
    specialCard: {
      id: "10014",
      img: "10014.png",
      idx: 10014,
      card_id: 10014,
      isSpecial: true,
    },
  });

  expect(events).toEqual([]);
});
