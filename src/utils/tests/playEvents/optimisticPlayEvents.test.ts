import { expect, test } from "vitest";
import { EventTypeEnum } from "../../../dojo/typescript/custom";
import { ModifiersId } from "../../../enums/modifiersId";
import { Card } from "../../../types/Card";
import { PlayEvents } from "../../../types/ScoreData";
import { buildOptimisticCardPlayEvents } from "../../playEvents/buildOptimisticCardPlayEvents";
import { buildOptimisticPowerUpEvents } from "../../playEvents/buildOptimisticPowerUpEvents";
import { filterOptimisticEventsFromPlayEvents } from "../../playEvents/filterOptimisticEventsFromPlayEvents";
import { filterSilentCardEventsFromPlayEvents } from "../../playEvents/filterSilentCardEventsFromPlayEvents";
import { C9, D7, H7, JOKER1, JOKER2 } from "../../mocks/cardMocks";
import { WildcardModifier } from "../../mocks/modifierMocks";

const withIdx = (cards: Card[]): Card[] =>
  cards.map((card, index) => ({
    ...card,
    idx: index,
    id: `${card.id}-${index}`,
  }));

test("buildOptimisticCardPlayEvents only scores cards that compose the play", () => {
  const hand = withIdx([H7, D7, C9]);

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards: [0, 1, 2],
    specialCards: [],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([
    {
      hand: [{ idx: 0, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 1, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
  ]);
});

test("buildOptimisticCardPlayEvents orders events left-to-right with points first then multi", () => {
  const hand: Card[] = [
    { ...H7, id: `${H7.id}-left`, isNeon: true },
    { ...D7, id: `${D7.id}-middle`, isNeon: true },
    { ...C9, id: `${C9.id}-right` },
  ];

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards: [H7.idx, D7.idx, C9.idx],
    specialCards: [],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([
    {
      hand: [{ idx: H7.idx, quantity: 14 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: D7.idx, quantity: 14 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: H7.idx, quantity: 1 }],
      specials: [],
      eventType: EventTypeEnum.Multi,
    },
    {
      hand: [{ idx: D7.idx, quantity: 1 }],
      specials: [],
      eventType: EventTypeEnum.Multi,
    },
  ]);
});

test("buildOptimisticCardPlayEvents follows preselected left-to-right order", () => {
  const hand = withIdx([
    { ...H7, isNeon: true },
    { ...D7, isNeon: true },
    C9,
  ]);

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards: [1, 0, 2],
    specialCards: [],
    preSelectedModifiers: {},
  });

  expect(events).toEqual([
    {
      hand: [{ idx: 1, quantity: 14 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 0, quantity: 14 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 1, quantity: 1 }],
      specials: [],
      eventType: EventTypeEnum.Multi,
    },
    {
      hand: [{ idx: 0, quantity: 1 }],
      specials: [],
      eventType: EventTypeEnum.Multi,
    },
  ]);
});

test("buildOptimisticCardPlayEvents applies joker scoring", () => {
  const regularJoker = withIdx([JOKER1]);
  const neonJoker = withIdx([JOKER2]);

  const regularEvents = buildOptimisticCardPlayEvents({
    hand: regularJoker,
    preSelectedCards: [0],
    specialCards: [],
    preSelectedModifiers: {},
  });

  const neonEvents = buildOptimisticCardPlayEvents({
    hand: neonJoker,
    preSelectedCards: [0],
    specialCards: [],
    preSelectedModifiers: {},
  });

  expect(regularEvents).toEqual([
    {
      hand: [{ idx: 0, quantity: 100 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 0, quantity: 1 }],
      specials: [],
      eventType: EventTypeEnum.Multi,
    },
  ]);

  expect(neonEvents).toEqual([
    {
      hand: [{ idx: 0, quantity: 200 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 0, quantity: 2 }],
      specials: [],
      eventType: EventTypeEnum.Multi,
    },
  ]);
});

test("buildOptimisticCardPlayEvents treats neon modifier as neon scoring", () => {
  const neonModifier: Card = {
    img: "612.png",
    id: "612",
    idx: 2,
    card_id: ModifiersId.NEON_MODIFIER,
    isModifier: true,
  };
  const hand = withIdx([H7, D7, neonModifier]);

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards: [0, 1],
    specialCards: [],
    preSelectedModifiers: { 1: [2] },
  });

  expect(events).toEqual([
    {
      hand: [{ idx: 0, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 1, quantity: 14 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 1, quantity: 1 }],
      specials: [],
      eventType: EventTypeEnum.Multi,
    },
  ]);
});

test("buildOptimisticCardPlayEvents skips silent cards", () => {
  const hand = withIdx([H7, D7, C9]);

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards: [0, 1, 2],
    specialCards: [],
    preSelectedModifiers: {},
    silentCardIndexes: new Set([0]),
  });

  expect(events).toEqual([
    {
      hand: [{ idx: 1, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
  ]);
});

test("buildOptimisticCardPlayEvents skips all selected cards when play is debuffed", () => {
  const hand = withIdx([H7, D7, C9]);

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards: [0, 1, 2],
    specialCards: [],
    preSelectedModifiers: {},
    silentCardIndexes: new Set([0, 1, 2]),
  });

  expect(events).toEqual([]);
});

test("buildOptimisticCardPlayEvents does not score cards with wildcard modifier", () => {
  const hand = withIdx([H7, D7, C9, WildcardModifier]);

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards: [0, 1, 2],
    specialCards: [],
    preSelectedModifiers: {
      2: [3],
    },
  });

  expect(events).toEqual([
    {
      hand: [{ idx: 0, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 1, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
  ]);
});

test("filterOptimisticEventsFromPlayEvents removes only duplicated optimistic effects", () => {
  const optimisticEvents = [
    {
      hand: [{ idx: 0, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 1, quantity: 14 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 1, quantity: 1 }],
      specials: [],
      eventType: EventTypeEnum.Multi,
    },
  ];

  const backendPlayEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    cardPlayEvents: [
      ...optimisticEvents,
      {
        hand: [{ idx: 0, quantity: 7 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
      {
        hand: [{ idx: 1, quantity: 1 }],
        specials: [{ idx: 10001, quantity: 1 }],
        eventType: EventTypeEnum.Multi,
      },
    ],
  };

  const filtered = filterOptimisticEventsFromPlayEvents(
    backendPlayEvents,
    optimisticEvents
  );

  expect(filtered.cardPlayEvents).toEqual([
    {
      hand: [{ idx: 0, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: 1, quantity: 1 }],
      specials: [{ idx: 10001, quantity: 1 }],
      eventType: EventTypeEnum.Multi,
    },
  ]);
});

test("buildOptimisticPowerUpEvents maps selected powerups into point/multi events", () => {
  const optimisticPowerUps = buildOptimisticPowerUpEvents({
    preSelectedPowerUps: [0, 1],
    powerUps: [
      { idx: 0, power_up_id: 800, game_id: 1, cost: 0, discount_cost: 0, purchased: false, img: "" },
      { idx: 1, power_up_id: 805, game_id: 1, cost: 0, discount_cost: 0, purchased: false, img: "" },
    ],
  });

  expect(optimisticPowerUps).toEqual([
    { idx: 0, points: 25, multi: 0 },
    { idx: 1, points: 0, multi: 5 },
  ]);
});

test("buildOptimisticPowerUpEvents orders selected powerups left-to-right", () => {
  const optimisticPowerUps = buildOptimisticPowerUpEvents({
    preSelectedPowerUps: [7, 2],
    powerUps: [
      { idx: 2, power_up_id: 800, game_id: 1, cost: 0, discount_cost: 0, purchased: false, img: "" },
      { idx: 7, power_up_id: 805, game_id: 1, cost: 0, discount_cost: 0, purchased: false, img: "" },
    ],
  });

  expect(optimisticPowerUps).toEqual([
    { idx: 2, points: 25, multi: 0 },
    { idx: 7, points: 0, multi: 5 },
  ]);
});

test("filterOptimisticEventsFromPlayEvents deduplicates optimistic powerups too", () => {
  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    powerUpEvents: [
      { idx: 0, points: 25, multi: 0 },
      { idx: 1, points: 0, multi: 5 },
      { idx: 2, points: 50, multi: 0 },
    ],
  };

  const filtered = filterOptimisticEventsFromPlayEvents(
    playEvents,
    [],
    [
      { idx: 0, points: 25, multi: 0 },
      { idx: 1, points: 0, multi: 5 },
    ]
  );

  expect(filtered.powerUpEvents).toEqual([{ idx: 2, points: 50, multi: 0 }]);
});

test("filterSilentCardEventsFromPlayEvents removes silent cards from animated events", () => {
  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    neonPlayEvent: {
      neon_cards_idx: [0, 1],
      points: 20,
      multi: 1,
    },
    cardPlayChangeEvents: [
      {
        hand: [{ idx: 0, quantity: 1 }],
        specials: [],
        eventType: EventTypeEnum.Neon,
      },
    ],
    cardPlayEvents: [
      {
        hand: [{ idx: 0, quantity: 7 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
      {
        hand: [{ idx: 1, quantity: 7 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
    ],
  };

  const filtered = filterSilentCardEventsFromPlayEvents(
    playEvents,
    new Set([0])
  );

  expect(filtered.neonPlayEvent).toEqual({
    neon_cards_idx: [1],
    points: 20,
    multi: 1,
  });
  expect(filtered.cardPlayChangeEvents).toEqual([]);
  expect(filtered.cardPlayEvents).toEqual([
    {
      hand: [{ idx: 1, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
  ]);
});
