import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { ModifiersId } from "../../../enums/modifiersId";
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

// Helper to assign idx based on array position
const withIdx = (cards: Card[]): Card[] =>
  cards.map((card, index) => ({ ...card, idx: index }));

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
  const hand = withIdx([D10, DJ, DQ, DK, DA, H7, H9]);
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.ROYAL_FLUSH);
  expect(result.isNeon).toBe(false);
});

test("checkHand should return neon for all-neon royal flush", () => {
  const hand = withIdx([D10N, DJN, DQN, DKN, DAN, H7, H9]);
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.ROYAL_FLUSH);
  expect(result.isNeon).toBe(true);
});

test("checkHand should return non-neon for mixed neon/regular four of a kind", () => {
  const hand = withIdx([H7N, D7N, C7, S7, H9]);
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.FOUR_OF_A_KIND);
  expect(result.isNeon).toBe(false);
});

test("checkHand should return neon for all-neon four of a kind", () => {
  const hand = withIdx([H7N, D7N, C7N, S7N, H9N]);
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.FOUR_OF_A_KIND);
  expect(result.isNeon).toBe(true);
});

test("checkHand should return non-neon for regular pair", () => {
  const hand = withIdx([H7, D7, H9]);
  const preSelectedCards = [0, 1, 2];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.PAIR);
  expect(result.isNeon).toBe(false);
});

test("checkHand should return neon for all-neon pair", () => {
  const hand = withIdx([H7N, D7N, H9N]);
  const preSelectedCards = [0, 1, 2];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.PAIR);
  expect(result.isNeon).toBe(true);
});

test("checkHand should handle jokers correctly - neon with jokers", () => {
  const JOKER: Card = {
    value: Cards.JOKER,
    suit: Suits.JOKER,
    img: "52.png",
    id: "52",
    idx: 52,
    card_id: 52,
  };

  const hand = withIdx([H7N, D7N, C7N, JOKER, H9N]);
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.FOUR_OF_A_KIND);
  expect(result.isNeon).toBe(true); // Jokers don't break neon status
});

test("checkHand should handle jokers correctly - non-neon with jokers", () => {
  const JOKER: Card = {
    value: Cards.JOKER,
    suit: Suits.JOKER,
    img: "52.png",
    id: "52",
    idx: 52,
    card_id: 52,
  };

  const hand = withIdx([H7N, D7, C7, JOKER, H9]);
  const preSelectedCards = [0, 1, 2, 3, 4];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.FOUR_OF_A_KIND);
  expect(result.isNeon).toBe(false); // Mixed regular and neon cards
});

test("checkHand should return false isNeon for empty selection", () => {
  const hand = withIdx([H7N, D7N, C7N]);
  const preSelectedCards: number[] = [];

  const result = checkHand(hand, preSelectedCards, [], {});

  expect(result.play).toBe(Plays.HIGH_CARD);
  expect(result.isNeon).toBe(false);
});

test("checkHand should detect neon modifier as neon - pair with one neon modifier", () => {
  // Create neon modifier card
  const NEON_MOD: Card = {
    value: undefined,
    suit: undefined,
    img: "612.png",
    id: "612",
    idx: 2,
    card_id: ModifiersId.NEON_MODIFIER,
    isModifier: true,
  };

  // H10 neon + D10 regular with neon modifier
  const hand = withIdx([H7N, D7, NEON_MOD]);
  const preSelectedCards = [0, 1];
  const preSelectedModifiers = {
    1: [2], // D7 has neon modifier applied
  };

  const result = checkHand(hand, preSelectedCards, [], preSelectedModifiers);

  expect(result.play).toBe(Plays.PAIR);
  expect(result.isNeon).toBe(true); // Should be neon because D7 has neon modifier
});

test("checkHand should detect neon modifier as neon - all cards with neon modifier", () => {
  // Create neon modifier cards
  const NEON_MOD1: Card = {
    value: undefined,
    suit: undefined,
    img: "612.png",
    id: "612-1",
    idx: 2,
    card_id: ModifiersId.NEON_MODIFIER,
    isModifier: true,
  };

  const NEON_MOD2: Card = {
    value: undefined,
    suit: undefined,
    img: "612.png",
    id: "612-2",
    idx: 3,
    card_id: ModifiersId.NEON_MODIFIER,
    isModifier: true,
  };

  // Two regular cards with neon modifiers
  const hand = withIdx([H7, D7, NEON_MOD1, NEON_MOD2]);
  const preSelectedCards = [0, 1];
  const preSelectedModifiers = {
    0: [2], // H7 has neon modifier
    1: [3], // D7 has neon modifier
  };

  const result = checkHand(hand, preSelectedCards, [], preSelectedModifiers);

  expect(result.play).toBe(Plays.PAIR);
  expect(result.isNeon).toBe(true); // Should be neon because both cards have neon modifiers
});
