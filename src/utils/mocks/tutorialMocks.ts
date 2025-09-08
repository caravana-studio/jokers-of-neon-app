import { EventTypeEnum } from "../../dojo/typescript/custom";
import {
  C10,
  C5,
  C7,
  CA,
  CJ,
  CQ,
  D2,
  D5,
  D7,
  H10,
  H3,
  H5,
  H7,
  S6,
  S9,
} from "./cardMocks";
import { ClubModifier } from "./modifierMocks";

export const HAND_1 = [D2, H3, C5, H7, S9, C10, CJ, CA];
// discard D2 H3
export const HAND_2 = [C5, S6, D7, H7, S9, CJ, C10, CA];
// play C7 H7
export const HAND_3 = [H5, C5, S6, S9, CJ, CQ, C10, CA];
// play play H5 D5
export const HAND_4 = [S6, S9, H10, CJ, CQ, C10, CA, ClubModifier];

export const EVENT_FLUSH = {
  play: {
    multi: 1,
    points: 0,
  },
  cardPlayScoreEvents: [
    {
      hand: [{ idx: H10.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: C10.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: CJ.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: CQ.idx, quantity: 10 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: CA.idx, quantity: 11 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: H10.idx, quantity: 2 }],
      specials: [{ idx: 10001, quantity: 2 }],
      eventType: EventTypeEnum.Multi,
    },
    {
      hand: [{ idx: C10.idx, quantity: 2 }],
      specials: [{ idx: 10001, quantity: 2 }],
      eventType: EventTypeEnum.Multi,
    },
    {
      hand: [{ idx: CJ.idx, quantity: 2 }],
      specials: [{ idx: 10001, quantity: 2 }],
      eventType: EventTypeEnum.Multi,
    },
    {
      hand: [{ idx: CQ.idx, quantity: 2 }],
      specials: [{ idx: 10001, quantity: 2 }],
      eventType: EventTypeEnum.Multi,
    },
    {
      hand: [{ idx: CA.idx, quantity: 2 }],
      specials: [{ idx: 10001, quantity: 2 }],
      eventType: EventTypeEnum.Multi,
    },
  ],
  gameOver: false,
  cards: [],
  score: 1615,
};

export const MOCKED_PLAYS = [
  {
    game_id: "25",
    poker_hand: "RoyalFlush",
    level: 1,
    multi: 9,
    points: 120,
  },
  {
    game_id: "25",
    poker_hand: "StraightFlush",
    level: 1,
    multi: 8,
    points: 100,
  },
  {
    game_id: "25",
    poker_hand: "FiveOfAKind",
    level: 1,
    multi: 8,
    points: 80,
  },
  {
    game_id: "25",
    poker_hand: "FourOfAKind",
    level: 1,
    multi: 7,
    points: 60,
  },
  {
    game_id: "25",
    poker_hand: "FullHouse",
    level: 1,
    multi: 4,
    points: 40,
  },
  {
    game_id: "25",
    poker_hand: "Straight",
    level: 1,
    multi: 4,
    points: 30,
  },
  {
    game_id: "25",
    poker_hand: "Flush",
    level: 1,
    multi: 4,
    points: 35,
  },
  {
    game_id: "25",
    poker_hand: "ThreeOfAKind",
    level: 1,
    multi: 3,
    points: 30,
  },
  {
    game_id: "25",
    poker_hand: "TwoPair",
    level: 1,
    multi: 3,
    points: 20,
  },
  {
    game_id: "25",
    poker_hand: "OnePair",
    level: 1,
    multi: 2,
    points: 10,
  },
  {
    game_id: "25",
    poker_hand: "HighCard",
    level: 1,
    multi: 1,
    points: 5,
  },
];

export const EVENT_PAIR = {
  play: {
    multi: 1,
    points: 0,
  },
  cardPlayScoreEvents: [
    {
      hand: [{ idx: D7.idx, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: H7.idx, quantity: 7 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
  ],
  gameOver: false,
  cards: HAND_3,
  score: 48,
};

export const EVENT_PAIR_POWER_UPS = {
  play: {
    multi: 1,
    points: 0,
  },
  cardPlayScoreEvents: [
    {
      hand: [{ idx: H5.idx, quantity: 5 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: C5.idx, quantity: 5 }],
      specials: [],
      eventType: EventTypeEnum.Point,
    },
    {
      hand: [{ idx: C5.idx, quantity: 2 }],
      specials: [{ idx: 10001, quantity: 2 }],
      eventType: EventTypeEnum.Multi,
    },
  ],
  gameOver: false,
  cards: HAND_4,
  score: 453,
  powerUpEvents: [
    {
      idx: 0,
      points: 0,
      multi: 5,
    },
    {
      idx: 1,
      points: 25,
      multi: 0,
    },
  ],
};
