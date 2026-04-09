import { expect, test } from "vitest";
import { EventTypeEnum } from "../../../../dojo/typescript/custom";
import { Card } from "../../../../types/Card";
import { buildWildDeucesOptimisticEvents } from "../../../playEvents/converters/wildDeucesConverter";
import { D7, H2, S2 } from "../../../mocks/cardMocks";
import { WildDeuces } from "../../../mocks/specialCardMocks";

test("buildWildDeucesOptimisticEvents converts played 2s to wildcards", () => {
  const neonTwo: Card = {
    ...S2,
    id: "239",
    img: "239.png",
    idx: 2,
    card_id: 239,
    isNeon: true,
  };

  const events = buildWildDeucesOptimisticEvents({
    hand: [
      { ...H2, idx: 0, id: `${H2.id}-0` },
      { ...D7, idx: 1, id: `${D7.id}-1` },
      neonTwo,
    ],
    preSelectedCards: [0, 1, 2],
    preSelectedModifiers: {},
    specialCards: [WildDeuces],
    specialCard: WildDeuces,
  });

  expect(events).toEqual([
    {
      hand: [
        { idx: 0, quantity: 53 },
        { idx: 2, quantity: 253 },
      ],
      specials: [{ idx: WildDeuces.idx, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ]);
});

test("buildWildDeucesOptimisticEvents returns empty when no played card is a 2", () => {
  const events = buildWildDeucesOptimisticEvents({
    hand: [D7],
    preSelectedCards: [D7.idx],
    preSelectedModifiers: {},
    specialCards: [WildDeuces],
    specialCard: WildDeuces,
  });

  expect(events).toEqual([]);
});
