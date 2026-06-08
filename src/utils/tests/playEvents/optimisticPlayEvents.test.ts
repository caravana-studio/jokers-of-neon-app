import { expect, test } from "vitest";
import { EventTypeEnum } from "../../../dojo/typescript/custom";
import { ModifiersId } from "../../../enums/modifiersId";
import { Card } from "../../../types/Card";
import { PlayEvents } from "../../../types/ScoreData";
import { buildOptimisticCardPlayEvents } from "../../playEvents/buildOptimisticCardPlayEvents";
import { buildOptimisticConverterCardPlayChangeEvents } from "../../playEvents/buildOptimisticConverterCardPlayChangeEvents";
import { buildOptimisticPowerUpEvents } from "../../playEvents/buildOptimisticPowerUpEvents";
import { filterOptimisticEventsFromPlayEvents } from "../../playEvents/filterOptimisticEventsFromPlayEvents";
import { filterSilentCardEventsFromPlayEvents } from "../../playEvents/filterSilentCardEventsFromPlayEvents";
import { C9, D6, D7, D8, D9, H7, JOKER1, JOKER2, S7, S10 } from "../../mocks/cardMocks";
import { WildcardModifier } from "../../mocks/modifierMocks";
import {
  AllCardsToHearts,
  StraightToHighStraight,
} from "../../mocks/specialCardMocks";

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

test("buildOptimisticCardPlayEvents skips cards silenced after all-to-hearts conversion", () => {
  const hand = [D7];
  const preSelectedCards = [D7.idx];
  const rageCards: Card[] = [
    {
      id: "20001",
      img: "20001.png",
      idx: 20001,
      card_id: 20001,
    },
  ];
  const changeEvents = buildOptimisticConverterCardPlayChangeEvents({
    hand,
    preSelectedCards,
    specialCards: [AllCardsToHearts],
    preSelectedModifiers: {},
  });
  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards,
    specialCards: [AllCardsToHearts],
    preSelectedModifiers: {},
    rageCards,
    changeEvents,
  });

  expect(events).toEqual([]);
});

test("buildOptimisticCardPlayEvents scores cards unsilenced after all-to-hearts conversion", () => {
  const hand = [S7, D7];
  const preSelectedCards = [S7.idx, D7.idx];
  const rageCards: Card[] = [
    {
      id: "20004",
      img: "20004.png",
      idx: 20004,
      card_id: 20004,
    },
  ];
  const changeEvents = buildOptimisticConverterCardPlayChangeEvents({
    hand,
    preSelectedCards,
    specialCards: [AllCardsToHearts],
    preSelectedModifiers: {},
  });

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards,
    specialCards: [AllCardsToHearts],
    preSelectedModifiers: {},
    rageCards,
    changeEvents,
  });

  expect(events).toEqual([
    {
      hand: [{ idx: S7.idx, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: D7.idx, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
  ]);
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

test("buildOptimisticCardPlayEvents scores straight-to-high-straight with converted card values", () => {
  const hand = [D6, D7, D8, D9, S10];
  const preSelectedCards = [D6.idx, D7.idx, D8.idx, D9.idx, S10.idx];
  const changeEvents = buildOptimisticConverterCardPlayChangeEvents({
    hand,
    preSelectedCards,
    specialCards: [StraightToHighStraight],
    preSelectedModifiers: {},
  });

  const events = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards,
    specialCards: [StraightToHighStraight],
    preSelectedModifiers: {},
    changeEvents,
  });

  expect(events).toEqual([
    {
      hand: [{ idx: D6.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: D7.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: D8.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: D9.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: S10.idx, quantity: 11 }],
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

test("filterOptimisticEventsFromPlayEvents deduplicates converted straight card scores", () => {
  const hand = [D6, D7, D8, D9, S10];
  const preSelectedCards = [D6.idx, D7.idx, D8.idx, D9.idx, S10.idx];
  const changeEvents = buildOptimisticConverterCardPlayChangeEvents({
    hand,
    preSelectedCards,
    specialCards: [StraightToHighStraight],
    preSelectedModifiers: {},
  });
  const optimisticEvents = buildOptimisticCardPlayEvents({
    hand,
    preSelectedCards,
    specialCards: [StraightToHighStraight],
    preSelectedModifiers: {},
    changeEvents,
  });

  const backendPlayEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    cardPlayEvents: optimisticEvents,
  };

  const filtered = filterOptimisticEventsFromPlayEvents(
    backendPlayEvents,
    optimisticEvents
  );

  expect(filtered.cardPlayEvents).toEqual([]);
});

test("filterOptimisticEventsFromPlayEvents suppresses backend base score events when converter changed quantities", () => {
  const optimisticEvents = [
    {
      hand: [{ idx: D6.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: D7.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
  ];

  const backendPlayEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    cardPlayEvents: [
      {
        hand: [{ idx: D6.idx, quantity: 6 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
      {
        hand: [{ idx: D7.idx, quantity: 7 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
    ],
  };

  const filtered = filterOptimisticEventsFromPlayEvents(
    backendPlayEvents,
    optimisticEvents,
    [],
    [
      {
        hand: [{ idx: D6.idx, quantity: 21 }],
        specials: [{ idx: StraightToHighStraight.idx, quantity: 1 }],
        eventType: EventTypeEnum.Rank,
      },
    ]
  );

  expect(filtered.cardPlayEvents).toEqual([]);
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

test("filterOptimisticEventsFromPlayEvents deduplicates optimistic converter changes too", () => {
  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    cardPlayChangeEvents: [
      {
        hand: [{ idx: 0, quantity: 0 }],
        specials: [{ idx: 10014, quantity: 1 }],
        eventType: EventTypeEnum.Heart,
      },
      {
        hand: [{ idx: 1, quantity: 0 }],
        specials: [{ idx: 10014, quantity: 1 }],
        eventType: EventTypeEnum.Heart,
      },
      {
        hand: [{ idx: 9, quantity: 0 }],
        specials: [{ idx: 10210, quantity: 1 }],
        eventType: EventTypeEnum.Neon,
      },
    ],
  };

  const filtered = filterOptimisticEventsFromPlayEvents(playEvents, [], [], [
    {
      hand: [
        { idx: 0, quantity: 0 },
        { idx: 1, quantity: 0 },
      ],
      specials: [{ idx: 10014, quantity: 1 }],
      eventType: EventTypeEnum.Heart,
    },
  ]);

  expect(filtered.cardPlayChangeEvents).toEqual([
    {
      hand: [{ idx: 9, quantity: 0 }],
      specials: [{ idx: 10210, quantity: 1 }],
      eventType: EventTypeEnum.Neon,
    },
  ]);
});

test("filterOptimisticEventsFromPlayEvents deduplicates converter changes even when backend omits specials", () => {
  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    cardPlayChangeEvents: [
      {
        hand: [{ idx: 4, quantity: 0 }],
        specials: [],
        eventType: EventTypeEnum.Neon,
      },
    ],
  };

  const filtered = filterOptimisticEventsFromPlayEvents(playEvents, [], [], [
    {
      hand: [{ idx: 4, quantity: 0 }],
      specials: [{ idx: 10210, quantity: 1 }],
      eventType: EventTypeEnum.Neon,
    },
  ]);

  expect(filtered.cardPlayChangeEvents).toEqual([]);
});

test("filterOptimisticEventsFromPlayEvents deduplicates rank converter changes even when backend quantity differs", () => {
  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    cardPlayChangeEvents: [
      {
        hand: [{ idx: 7, quantity: 248 }],
        specials: [],
        eventType: EventTypeEnum.Rank,
      },
    ],
  };

  const filtered = filterOptimisticEventsFromPlayEvents(playEvents, [], [], [
    {
      hand: [{ idx: 7, quantity: 48 }],
      specials: [{ idx: 10201, quantity: 1 }],
      eventType: EventTypeEnum.Rank,
    },
  ]);

  expect(filtered.cardPlayChangeEvents).toEqual([]);
});

test("filterOptimisticEventsFromPlayEvents suppresses backend converter events of a type already animated optimistically", () => {
  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    cardPlayChangeEvents: [
      {
        hand: [{ idx: 3, quantity: 0 }],
        specials: [],
        eventType: EventTypeEnum.Neon,
      },
      {
        hand: [{ idx: 5, quantity: 0 }],
        specials: [],
        eventType: EventTypeEnum.Neon,
      },
      {
        hand: [{ idx: 7, quantity: 0 }],
        specials: [],
        eventType: EventTypeEnum.Heart,
      },
    ],
  };

  const filtered = filterOptimisticEventsFromPlayEvents(playEvents, [], [], [
    {
      hand: [{ idx: 3, quantity: 0 }],
      specials: [{ idx: 10210, quantity: 1 }],
      eventType: EventTypeEnum.Neon,
    },
  ]);

  expect(filtered.cardPlayChangeEvents).toEqual([
    {
      hand: [{ idx: 7, quantity: 0 }],
      specials: [],
      eventType: EventTypeEnum.Heart,
    },
  ]);
});

test("filterOptimisticEventsFromPlayEvents removes backend neonPlayEvent when optimistic card scoring is active", () => {
  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    neonPlayEvent: {
      neon_cards_idx: [3, 4],
      points: 20,
      multi: 2,
    },
  };

  const filtered = filterOptimisticEventsFromPlayEvents(
    playEvents,
    [
      {
        hand: [{ idx: 3, quantity: 14 }],
        specials: [],
        eventType: EventTypeEnum.Point,
      },
    ]
  );

  expect(filtered.neonPlayEvent).toBeUndefined();
});

test("filterOptimisticEventsFromPlayEvents removes backend neonPlayEvent when optimistic neon converter is active", () => {
  const playEvents: PlayEvents = {
    play: { points: 0, multi: 1 },
    gameOver: false,
    cards: [],
    score: 0,
    neonPlayEvent: {
      neon_cards_idx: [9],
      points: 20,
      multi: 2,
    },
  };

  const filtered = filterOptimisticEventsFromPlayEvents(
    playEvents,
    [],
    [],
    [
      {
        hand: [{ idx: 9, quantity: 0 }],
        specials: [{ idx: 10210, quantity: 1 }],
        eventType: EventTypeEnum.Neon,
      },
    ]
  );

  expect(filtered.neonPlayEvent).toBeUndefined();
});

test("filterSilentCardEventsFromPlayEvents keeps converter effects and removes score effects for silent cards", () => {
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
  expect(filtered.cardPlayChangeEvents).toEqual([
    {
      hand: [{ idx: 0, quantity: 1 }],
      specials: [],
      eventType: EventTypeEnum.Neon,
    },
  ]);
  expect(filtered.cardPlayEvents).toEqual([
    {
      hand: [{ idx: 1, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
  ]);
});
