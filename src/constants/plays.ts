import { Card } from "../types/Card";
import { HA, CK, DQ, S9, H7, D7, C9, H9, D8, S10, HJ, H4, C7, S7, D10, D9, DJ, DA, DK } from "../utils/mocks/cardMocks";

export const PLAYS: string[] = [
  "None",
  "Royal flush",
  "Straight flush",
  "Four of a kind",
  "Full house",
  "Straight",
  "Flush",
  "Three of a kind",
  "Two pair",
  "Pair",
  "High card",
  "Five of a kind",
];

export const PLAYS_DATA: PlaysData[] =
[
  {
    name: "High card",
    description: "It consists of single cards, which are not consecutive and of different suits",
    example: [HA, CK, DQ, S9, H7]
  },
  {
    name: "Pair",
    description: "Two cards of the same rank",
    example: [H7, D7, HA, CK, DQ]
  },
  {
    name: "Two pair",
    description: "Two pairs of cards of different rank",
    example: [H7, D7, C9, S9, HA]
  },
  {
    name: "Three of a kind",
    description: "Three cards of the same rank",
    example: [C9, S9, H9, HA, D7]
  },
  {
    name: "Flush",
    description: "Five cards of the same suit",
    example: [HA, H7, H9, H4, HJ]
  },
  {
    name: "Straight",
    description: "Five consecutive cards",
    example: [D7, D8, H9, S10, HJ]
  },
  {
    name: "Full house",
    description: "Three of a kind and a pair",
    example: [H7, D7, C7, S9, H9]
  },
  {
    name: "Four of a kind",
    description: "Four cards of the same rank",
    example: [H7, D7, C7, S7, H9]
  },
  {
    name: "Five of a kind",
    description: "Five cards of the same rank",
    example: [H7, D7, C7, S7, S7]
  },
  {
    name: "Straight flush",
    description: "Straight of the same suit",
    example: [D7, D8, D9, D10, DJ]
  },
  {
    name: "Royal flush",
    description: "Highest straight flush",
    example: [D10, DJ, DQ, DK, DA]
  }
]

interface PlaysData
{
  name: string,
  description: string,
  example: Card[],
}