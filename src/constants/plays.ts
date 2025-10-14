import { Card } from "../types/Card";
import {
  C7,
  C9,
  CK,
  D10,
  D7,
  D8,
  D9,
  DA,
  DJ,
  DK,
  DQ,
  H4,
  H7,
  H9,
  HA,
  HJ,
  S10,
  S7,
  S9,
} from "../utils/mocks/cardMocks";

interface PlaysData {
  name: string;
  example: Card[];
  importantCards: Card[];
}
export const PLAYS_DATA: PlaysData[] = [
  {
    name: "None",
    example: [],
    importantCards: [],
  },
  {
    name: "RoyalFlush",
    example: [D10, DJ, DQ, DK, DA],
    importantCards: [D10, DJ, DQ, DK, DA],
  },
  {
    name: "StraightFlush",
    example: [D7, D8, D9, D10, DJ],
    importantCards: [D7, D8, D9, D10, DJ],
  },
  {
    name: "FiveOfAKind",
    example: [H7, D7, C7, S7, S7],
    importantCards: [H7, D7, C7, S7, S7],
  },
  {
    name: "FourOfAKind",
    example: [H7, D7, C7, S7, H9],
    importantCards: [H7, D7, C7, S7],
  },
  {
    name: "FullHouse",
    example: [H7, D7, C7, S9, H9],
    importantCards: [H7, D7, C7, S9, H9],
  },
  {
    name: "Straight",
    example: [D7, D8, H9, S10, HJ],
    importantCards: [D7, D8, H9, S10, HJ],
  },
  {
    name: "Flush",
    example: [HA, H7, H9, H4, HJ],
    importantCards: [HA, H7, H9, H4, HJ],
  },
  {
    name: "ThreeOfAKind",
    example: [C9, S9, H9, HA, D7],
    importantCards: [C9, S9, H9],
  },
  {
    name: "TwoPair",
    example: [H7, D7, C9, S9, HA],
    importantCards: [H7, D7, C9, S9],
  },
  {
    name: "OnePair",
    example: [H7, D7, HA, CK, DQ],
    importantCards: [H7, D7],
  },
  {
    name: "HighCard",
    example: [HA, CK, DQ, S9, H7],
    importantCards: [HA],
  },
];

export const FILTERED_PLAYS_DATA: PlaysData[] = PLAYS_DATA.slice(1)