import { Card } from "../types/Card";
import { HA, CK, DQ, S9, H7 } from "../utils/mocks/cardMocks";

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
  }
]

interface PlaysData
{
  name: string,
  description: string,
  example: Card[],
}