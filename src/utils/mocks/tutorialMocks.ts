import { EventType } from "../../dojo/typescript/models.gen";
import {
  C7,
  CA,
  CJ,
  CK,
  CQ,
  D2,
  D5,
  H10,
  H3,
  H5,
  H7,
  S6,
  S9,
} from "./cardMocks";
import { ClubModifier } from "./modifierMocks";

export const HAND_1 = [D2, H3, D5, H7, S9, CJ, CK, CA];
// discard D2 H3
export const HAND_2 = [D5, S6, C7, H7, S9, CJ, CK, CA];
// play C7 H7
export const HAND_3 = [H5, D5, S6, S9, CJ, CQ, CK, CA];
// play play H5 D5
export const HAND_4 = [S6, S9, H10, CJ, CQ, CK, CA, ClubModifier];

export const EVENT_FLUSH = {
  play: {
    multi: 1,
    points: 0,
  },
  cardPlayScoreEvents: [
    {
      hand: [{ idx: H10.idx, quantity: 10 }],
      specials: [],
      eventType: EventType.Point,
    },
    {
      hand: [{ idx: CJ.idx, quantity: 10 }],
      specials: [],
      eventType: EventType.Point,
    },
    {
      hand: [{ idx: CQ.idx, quantity: 10 }],
      specials: [],
      eventType: EventType.Point,
    },
    {
      hand: [{ idx: CK.idx, quantity: 10 }],
      specials: [],
      eventType: EventType.Point,
    },
    {
      hand: [{ idx: CA.idx, quantity: 11 }],
      specials: [],
      eventType: EventType.Point,
    },
    {
      hand: [{ idx: H10.idx, quantity: 2 }],
      specials: [{ idx: 301, quantity: 2 }],
      eventType: EventType.Multi,
    },
    {
      hand: [{ idx: CJ.idx, quantity: 2 }],
      specials: [{ idx: 301, quantity: 2 }],
      eventType: EventType.Multi,
    },
    {
      hand: [{ idx: CQ.idx, quantity: 2 }],
      specials: [{ idx: 301, quantity: 2 }],
      eventType: EventType.Multi,
    },
    {
      hand: [{ idx: CK.idx, quantity: 2 }],
      specials: [{ idx: 301, quantity: 2 }],
      eventType: EventType.Multi,
    },
    {
      hand: [{ idx: CA.idx, quantity: 2 }],
      specials: [{ idx: 301, quantity: 2 }],
      eventType: EventType.Multi,
    },
  ],
  gameOver: false,
  cards: [],
  score: 5200,
};

export const EVENT_PAIR = {
  play: {
    multi: 1,
    points: 0,
  },
  cardPlayScoreEvents: [
    {
      hand: [{ idx: C7.idx, quantity: 7 }],
      specials: [],
      eventType: EventType.Point,
    },
    {
      hand: [{ idx: H7.idx, quantity: 7 }],
      specials: [],
      eventType: EventType.Point,
    },
    {
      hand: [{ idx: C7.idx, quantity: 2 }],
      specials: [{ idx: 301, quantity: 2 }],
      eventType: EventType.Multi,
    },
  ],
  gameOver: false,
  cards: HAND_3,
  score: 96,
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
      eventType: EventType.Point,
    },
    {
      hand: [{ idx: D5.idx, quantity: 5 }],
      specials: [],
      eventType: EventType.Point,
    },
  ],
  gameOver: false,
  cards: HAND_4,
  score: 411,
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
