import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { checkHand } from "../../checkHand";
import {
  H7,
  D7,
  C7,
  S7,
  H9,
  D10,
  DJ,
  DQ,
  DK,
  DA,
} from "../../mocks/cardMocks";
import { Card } from "../../../types/Card";
import { Cards } from "../../../enums/cards";
import { Suits } from "../../../enums/suits";

// Create neon versions of cards for testing
const H7N: Card = { ...H7, isNeon: true, card_id: 243, img: "243.png" };
const D7N: Card = { ...D7, isNeon: true, card_id: 244, img: "244.png" };
const C7N: Card = { ...C7, isNeon: true, card_id: 245, img: "245.png" };
const S7N: Card = { ...S7, isNeon: true, card_id: 246, img: "246.png" };
const H9N: Card = { ...H9, isNeon: true, card_id: 247, img: "247.png" };

const D10N: Card = { ...D10, isNeon: true, card_id: 248, img: "248.png" };
const DJN: Card = { ...DJ, isNeon: true, card_id: 249, img: "249.png" };
const DQN: Card = { ...DQ, isNeon: true, card_id: 250, img: "250.png" };
const DKN: Card = { ...DK, isNeon: true, card_id: 251, img: "251.png" };
const DAN: Card = { ...DA, isNeon: true, card_id: 252, img: "252.png" };

test("checkHand should return non-neon for regular flush", () => {
  const hand = [D10, DJ, DQ, DK, DA, H7, H9];
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.ROYAL_FLUSH);
  expect(result.isNeon).toBe(false);
});

test("checkHand should return neon for all-neon royal flush", () => {
  const hand = [D10N, DJN, DQN, DKN, DAN, H7, H9];
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.ROYAL_FLUSH);
  expect(result.isNeon).toBe(true);
});

test("checkHand should return non-neon for mixed neon/regular four of a kind", () => {
  const hand = [H7N, D7N, C7, S7, H9];
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.FOUR_OF_A_KIND);
  expect(result.isNeon).toBe(false);
});

test("checkHand should return neon for all-neon four of a kind", () => {
  const hand = [H7N, D7N, C7N, S7N, H9N];
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.FOUR_OF_A_KIND);
  expect(result.isNeon).toBe(true);
});

test("checkHand should return non-neon for regular pair", () => {
  const hand = [H7, D7, H9];
  const preSelectedCards = [0, 1, 2];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.PAIR);
  expect(result.isNeon).toBe(false);
});

test("checkHand should return neon for all-neon pair", () => {
  const hand = [H7N, D7N, H9N];
  const preSelectedCards = [0, 1, 2];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.PAIR);
  expect(result.isNeon).toBe(true);
});

test("checkHand should handle jokers correctly - neon with jokers", () => {
  const JOKER: Card = {
    value: Cards.JOKER,
    suit: Suits.JOKER,
    img: "joker.png",
    id: "joker1",
    idx: 100,
    card_id: 100,
  };

  const hand = [H7N, D7N, C7N, JOKER, H9];
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.FOUR_OF_A_KIND);
  expect(result.isNeon).toBe(true); // Jokers don't break neon status
});

test("checkHand should handle jokers correctly - non-neon with jokers", () => {
  const JOKER: Card = {
    value: Cards.JOKER,
    suit: Suits.JOKER,
    img: "joker.png",
    id: "joker1",
    idx: 100,
    card_id: 100,
  };

  const hand = [H7N, D7, C7, JOKER, H9];
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.FOUR_OF_A_KIND);
  expect(result.isNeon).toBe(false); // Mixed regular and neon cards
});

test("checkHand should return false isNeon for empty selection", () => {
  const hand = [H7N, D7N, C7N];
  const preSelectedCards: number[] = [];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.HIGH_CARD);
  expect(result.isNeon).toBe(false);
});
