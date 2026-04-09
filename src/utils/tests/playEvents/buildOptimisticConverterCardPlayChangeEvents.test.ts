import { expect, test } from "vitest";
import { specialCardIds } from "../../../constants/specialCardIds";
import { EventTypeEnum } from "../../../dojo/typescript/custom";
import { Card } from "../../../types/Card";
import {
  buildOptimisticConverterCardPlayChangeEvents,
  canOptimisticallyBuildConverterEvents,
  getActiveConverterSpecialCards,
} from "../../playEvents/buildOptimisticConverterCardPlayChangeEvents";
import { D6, D7, D8, D9, H2, H7, S10 } from "../../mocks/cardMocks";
import {
  AllCardsToHearts,
  NeonSynergy,
  StraightToHighStraight,
  WildDeuces,
} from "../../mocks/specialCardMocks";

const unsupportedConverter: Card = {
  id: "10025",
  img: "10025.png",
  idx: 10025,
  card_id: 10025,
  isSpecial: true,
};

test("getActiveConverterSpecialCards ignores silenced converter cards", () => {
  const activeConverters = getActiveConverterSpecialCards([
    { ...AllCardsToHearts, silenced: true },
    unsupportedConverter,
  ]);

  expect(activeConverters).toEqual([unsupportedConverter]);
});

test("canOptimisticallyBuildConverterEvents fails when an active converter has no local behavior", () => {
  expect(canOptimisticallyBuildConverterEvents([unsupportedConverter])).toBe(
    false
  );
});

test("buildOptimisticConverterCardPlayChangeEvents builds hearts conversion for supported converter", () => {
  const events = buildOptimisticConverterCardPlayChangeEvents({
    hand: [H7, D7],
    preSelectedCards: [H7.idx, D7.idx],
    specialCards: [AllCardsToHearts],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: H7.idx, quantity: 0 },
        { idx: D7.idx, quantity: 0 },
      ],
      specials: [{ idx: AllCardsToHearts.idx, quantity: 1 }],
      eventType: EventTypeEnum.Heart,
    },
  ]);
});

test("buildOptimisticConverterCardPlayChangeEvents returns empty when any active converter is unsupported", () => {
  const events = buildOptimisticConverterCardPlayChangeEvents({
    hand: [H7, D7],
    preSelectedCards: [H7.idx, D7.idx],
    specialCards: [AllCardsToHearts, unsupportedConverter],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([]);
});

test("buildOptimisticConverterCardPlayChangeEvents supports straight-to-high-straight converter", () => {
  const events = buildOptimisticConverterCardPlayChangeEvents({
    hand: [D6, D7, D8, D9, S10],
    preSelectedCards: [D6.idx, D7.idx, D8.idx, D9.idx, S10.idx],
    specialCards: [StraightToHighStraight],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: D6.idx, quantity: 21 },
        { idx: D7.idx, quantity: 22 },
        { idx: D8.idx, quantity: 23 },
        { idx: D9.idx, quantity: 24 },
        { idx: S10.idx, quantity: 51 },
      ],
      specials: [{ idx: StraightToHighStraight.idx, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ]);
});

test("buildOptimisticConverterCardPlayChangeEvents supports neon synergy converter", () => {
  const neonD8 = {
    ...D8,
    id: "219",
    img: "219.png",
    idx: D8.idx,
    card_id: 219,
    isNeon: true,
  };
  const neonD9 = {
    ...D9,
    id: "220",
    img: "220.png",
    idx: D9.idx,
    card_id: 220,
    isNeon: true,
  };

  const events = buildOptimisticConverterCardPlayChangeEvents({
    hand: [H7, neonD8, D7, neonD9],
    preSelectedCards: [H7.idx, D8.idx, D7.idx, D9.idx],
    specialCards: [NeonSynergy],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: H7.idx, quantity: 0 },
        { idx: D7.idx, quantity: 0 },
      ],
      specials: [{ idx: NeonSynergy.idx, quantity: 1 }],
      eventType: EventTypeEnum.Neon,
    },
  ]);
});

test("buildOptimisticConverterCardPlayChangeEvents supports wild deuces converter", () => {
  const events = buildOptimisticConverterCardPlayChangeEvents({
    hand: [H2, D7],
    preSelectedCards: [H2.idx, D7.idx],
    specialCards: [WildDeuces],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([
    {
      hand: [{ idx: H2.idx, quantity: 53 }],
      specials: [{ idx: WildDeuces.idx, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ]);
});

test("buildOptimisticConverterCardPlayChangeEvents orders events by converter priority (suit before rank)", () => {
  const neonD8 = {
    ...D8,
    id: "219",
    img: "219.png",
    idx: D8.idx,
    card_id: 219,
    isNeon: true,
  };
  const neonD9 = {
    ...D9,
    id: "220",
    img: "220.png",
    idx: D9.idx,
    card_id: 220,
    isNeon: true,
  };
  const neonS10 = {
    ...S10,
    id: "247",
    img: "247.png",
    idx: S10.idx,
    card_id: 247,
    isNeon: true,
  };

  const events = buildOptimisticConverterCardPlayChangeEvents({
    hand: [D6, D7, neonD8, neonD9, neonS10],
    preSelectedCards: [D6.idx, D7.idx, D8.idx, D9.idx, S10.idx],
    specialCards: [StraightToHighStraight, AllCardsToHearts, NeonSynergy],
    preSelectedModifiers: {},
  });

  expect(events.map((event) => event.eventType)).toEqual([
    EventTypeEnum.Heart,
    EventTypeEnum.Neon,
    EventTypeEnum.Rank,
  ]);
  expect(events[0]?.specials[0]?.idx).toBe(specialCardIds.ALL_TO_HEARTS);
  expect(events[1]?.specials[0]?.idx).toBe(specialCardIds.NEON_SYNERGY);
  expect(events[2]?.specials[0]?.idx).toBe(
    specialCardIds.STRAIGHT_TO_HIGH_STRAIGHT
  );
});

test("buildOptimisticConverterCardPlayChangeEvents keeps neon conversion when straight-to-high-straight and neon-synergy are both active", () => {
  const neonD8 = {
    ...D8,
    id: "219",
    img: "219.png",
    idx: D8.idx,
    card_id: 219,
    isNeon: true,
  };
  const neonD9 = {
    ...D9,
    id: "220",
    img: "220.png",
    idx: D9.idx,
    card_id: 220,
    isNeon: true,
  };
  const neonS10 = {
    ...S10,
    id: "247",
    img: "247.png",
    idx: S10.idx,
    card_id: 247,
    isNeon: true,
  };

  const events = buildOptimisticConverterCardPlayChangeEvents({
    hand: [D6, D7, neonD8, neonD9, neonS10],
    preSelectedCards: [D6.idx, D7.idx, D8.idx, D9.idx, S10.idx],
    specialCards: [StraightToHighStraight, NeonSynergy],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: D6.idx, quantity: 0 },
        { idx: D7.idx, quantity: 0 },
      ],
      specials: [{ idx: NeonSynergy.idx, quantity: 1 }],
      eventType: EventTypeEnum.Neon,
    },
    {
      hand: [
        { idx: D6.idx, quantity: 221 },
        { idx: D7.idx, quantity: 222 },
        { idx: D8.idx, quantity: 223 },
        { idx: D9.idx, quantity: 224 },
        { idx: S10.idx, quantity: 251 },
      ],
      specials: [{ idx: StraightToHighStraight.idx, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ]);
});
