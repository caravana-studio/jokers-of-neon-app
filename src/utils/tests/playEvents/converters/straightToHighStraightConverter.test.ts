import { expect, test } from "vitest";
import { EventTypeEnum } from "../../../../dojo/typescript/custom";
import { Card } from "../../../../types/Card";
import { buildStraightToHighStraightOptimisticEvents } from "../../../playEvents/converters/straightToHighStraightConverter";
import {
  C6,
  D4,
  D6,
  D7,
  D8,
  D9,
  H5,
  JOKER1,
  S2,
  S3,
  S10,
} from "../../../mocks/cardMocks";
import {
  AllCardsToHearts,
  StraightToHighStraight,
} from "../../../mocks/specialCardMocks";

test("buildStraightToHighStraightOptimisticEvents maps straight cards to 10-J-Q-K-A in preselected order", () => {
  const neonSpadeThree: Card = {
    ...S3,
    id: "240",
    img: "240.png",
    idx: 101,
    card_id: 240,
    isNeon: true,
  };
  const hand: Card[] = [
    { ...H5, idx: 0, id: `${H5.id}-0` },
    { ...neonSpadeThree, idx: 1, id: `${neonSpadeThree.id}-1` },
    { ...D4, idx: 2, id: `${D4.id}-2` },
    { ...C6, idx: 3, id: `${C6.id}-3` },
    { ...S2, idx: 4, id: `${S2.id}-4` },
  ];

  const events = buildStraightToHighStraightOptimisticEvents({
    hand,
    preSelectedCards: [0, 1, 2, 3, 4],
    preSelectedModifiers: {},
    specialCard: StraightToHighStraight,
    specialCards: [StraightToHighStraight],
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: 0, quantity: 34 },
        { idx: 1, quantity: 248 },
        { idx: 2, quantity: 23 },
        { idx: 3, quantity: 11 },
        { idx: 4, quantity: 51 },
      ],
      specials: [{ idx: StraightToHighStraight.idx, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ]);
});

test("buildStraightToHighStraightOptimisticEvents skips jokers", () => {
  const hand: Card[] = [
    { ...D6, idx: 0, id: `${D6.id}-0` },
    { ...D7, idx: 1, id: `${D7.id}-1` },
    { ...D8, idx: 2, id: `${D8.id}-2` },
    { ...D9, idx: 3, id: `${D9.id}-3` },
    { ...JOKER1, idx: 4, id: `${JOKER1.id}-4` },
  ];

  const events = buildStraightToHighStraightOptimisticEvents({
    hand,
    preSelectedCards: [0, 1, 2, 3, 4],
    preSelectedModifiers: {},
    specialCard: StraightToHighStraight,
    specialCards: [StraightToHighStraight],
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: 0, quantity: 21 },
        { idx: 1, quantity: 22 },
        { idx: 2, quantity: 23 },
        { idx: 3, quantity: 24 },
      ],
      specials: [{ idx: StraightToHighStraight.idx, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ]);
});

test("buildStraightToHighStraightOptimisticEvents returns empty when play is not straight", () => {
  const events = buildStraightToHighStraightOptimisticEvents({
    hand: [H5, D7, D8, D9, S2],
    preSelectedCards: [H5.idx, D7.idx, D8.idx, D9.idx, S2.idx],
    preSelectedModifiers: {},
    specialCard: StraightToHighStraight,
    specialCards: [StraightToHighStraight],
  });

  expect(events).toEqual([]);
});

test("buildStraightToHighStraightOptimisticEvents preserves hearts suit when all-to-hearts converter is active", () => {
  const events = buildStraightToHighStraightOptimisticEvents({
    hand: [D6, D7, D8, D9, S10],
    preSelectedCards: [D6.idx, D7.idx, D8.idx, D9.idx, S10.idx],
    preSelectedModifiers: {},
    specialCard: StraightToHighStraight,
    specialCards: [AllCardsToHearts, StraightToHighStraight],
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: D6.idx, quantity: 34 },
        { idx: D7.idx, quantity: 35 },
        { idx: D8.idx, quantity: 36 },
        { idx: D9.idx, quantity: 37 },
        { idx: S10.idx, quantity: 38 },
      ],
      specials: [{ idx: StraightToHighStraight.idx, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ]);
});
