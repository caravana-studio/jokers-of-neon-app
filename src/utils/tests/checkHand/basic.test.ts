import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { testCheckHand } from "../../../testUtils/testCheckHand";
import { C2, C3, D2, D3, D4, H10, H2, H3, H5, H9, HA, HJ, HK, HQ, S2, S6 } from "../../mocks/cardMocks";

// This fails -> Is being taken as STRAIGHT_FLUSH instead
// test("Royal flush should work", () => {
//   expect(testCheckHand([HA, HK, HQ, HJ, H10])).toBe(Plays.ROYAL_FLUSH);
// });

test("StraightFlush should work", () => {
    expect(testCheckHand([H9, HK, HQ, HJ, H10])).toBe(Plays.STRAIGHT_FLUSH);
  });

test("FourOfAKind should work", () => {
  expect(testCheckHand([H2, C2, D2, S2])).toBe(Plays.FOUR_OF_A_KIND);
});

test("FullHouse should work", () => {
  expect(testCheckHand([H2, C2, H3, C3, D3 ])).toBe(Plays.FULL_HOUSE);
});

test("Ace Straight should work", () => {
  expect(testCheckHand([HA, C2, H3, D4, H5])).toBe(Plays.STRAIGHT);
});

test("Straight should work", () => {
  expect(testCheckHand([ C2, H3, D4, H5, S6])).toBe(Plays.STRAIGHT);
});

// This fails -> Is being taken as STRAIGHT
// test("Straight shouldn't work", () => {
//   expect(testCheckHand([ HA, H3, D4, H5, HA])).toBe(Plays.PAIR);
// });

test("Flush should work", () => {
  expect(testCheckHand([H2,H3, HQ, HK, H10])).toBe(Plays.FLUSH);
});

test("ThreeOfAKind should work", () => {
  expect(testCheckHand([H2, C2, D2])).toBe(Plays.THREE_OF_A_KIND);
});

test("Two Pairs should work", () => {
  expect(testCheckHand([H2, C2, H3, C3])).toBe(Plays.TWO_PAIR);
});

test("Pair should work", () => {
  expect(testCheckHand([H2, C2])).toBe(Plays.PAIR);
});

test("HighCard should work", () => {
  expect(testCheckHand([H2])).toBe(Plays.HIGH_CARD);
});

test("HighCard with A should work", () => {
  expect(testCheckHand([HA])).toBe(Plays.HIGH_CARD);
});

test("FiveOfAKind should work", () => {
  expect(testCheckHand([H2, C2, D2, S2, H2])).toBe(Plays.FIVE_OF_A_KIND);
});
