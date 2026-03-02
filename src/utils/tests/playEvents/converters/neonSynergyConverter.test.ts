import { expect, test } from "vitest";
import { EventTypeEnum } from "../../../../dojo/typescript/custom";
import { ModifiersId } from "../../../../enums/modifiersId";
import { Card } from "../../../../types/Card";
import { buildNeonSynergyOptimisticEvents } from "../../../playEvents/converters/neonSynergyConverter";
import { C9, D7, D8, H7, S6 } from "../../../mocks/cardMocks";
import { NeonSynergy } from "../../../mocks/specialCardMocks";

test("buildNeonSynergyOptimisticEvents converts non-neon cards when neon cards are 50% or more", () => {
  const neonD8: Card = {
    ...D8,
    id: "219",
    img: "219.png",
    idx: 1,
    card_id: 219,
    isNeon: true,
  };
  const neonS6: Card = {
    ...S6,
    id: "243",
    img: "243.png",
    idx: 3,
    card_id: 243,
    isNeon: true,
  };
  const hand: Card[] = [
    { ...H7, idx: 0, id: `${H7.id}-0` },
    neonD8,
    { ...C9, idx: 2, id: `${C9.id}-2` },
    neonS6,
  ];

  const events = buildNeonSynergyOptimisticEvents({
    hand,
    preSelectedCards: [0, 1, 2, 3],
    specialCards: [NeonSynergy],
    preSelectedModifiers: {},
    specialCard: NeonSynergy,
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: 0, quantity: 0 },
        { idx: 2, quantity: 0 },
      ],
      specials: [{ idx: NeonSynergy.idx, quantity: 1 }],
      eventType: EventTypeEnum.Neon,
    },
  ]);
});

test("buildNeonSynergyOptimisticEvents counts neon modifiers for threshold", () => {
  const neonModifier: Card = {
    img: "612.png",
    id: "612",
    idx: 5,
    card_id: ModifiersId.NEON_MODIFIER,
    isModifier: true,
  };
  const hand: Card[] = [
    { ...D7, idx: 0, id: `${D7.id}-0` },
    { ...C9, idx: 1, id: `${C9.id}-1` },
    neonModifier,
  ];

  const events = buildNeonSynergyOptimisticEvents({
    hand,
    preSelectedCards: [0, 1],
    specialCards: [NeonSynergy],
    preSelectedModifiers: {
      0: [5],
    },
    specialCard: NeonSynergy,
  });

  expect(events).toEqual([
    {
      hand: [{ idx: 1, quantity: 0 }],
      specials: [{ idx: NeonSynergy.idx, quantity: 1 }],
      eventType: EventTypeEnum.Neon,
    },
  ]);
});

test("buildNeonSynergyOptimisticEvents returns empty when neon is below 50%", () => {
  const neonD8: Card = {
    ...D8,
    id: "219",
    img: "219.png",
    idx: 1,
    card_id: 219,
    isNeon: true,
  };

  const events = buildNeonSynergyOptimisticEvents({
    hand: [
      { ...H7, idx: 0, id: `${H7.id}-0` },
      neonD8,
      { ...C9, idx: 2, id: `${C9.id}-2` },
    ],
    preSelectedCards: [0, 1, 2],
    specialCards: [NeonSynergy],
    preSelectedModifiers: {},
    specialCard: NeonSynergy,
  });

  expect(events).toEqual([]);
});

test("buildNeonSynergyOptimisticEvents returns empty when there are no neon cards", () => {
  const events = buildNeonSynergyOptimisticEvents({
    hand: [H7, D7, C9],
    preSelectedCards: [H7.idx, D7.idx, C9.idx],
    specialCards: [NeonSynergy],
    preSelectedModifiers: {},
    specialCard: NeonSynergy,
  });

  expect(events).toEqual([]);
});
