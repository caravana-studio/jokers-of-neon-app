import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { testCheckHand } from "../../../testUtils/testCheckHand";
import { C10, C2, C3, C4, C5, D10, D2, D3, D5, D6, D7, D8, DJ, DK, DQ, H10, H2, H3, H4, H5, H6, H8, H9, HA, HJ, JOKER1, JOKER2, S2, S3, S4, S5, S6, S7, S8, S9, SK } from "../../mocks/cardMocks";

test("One Joker should be high card", () => {
  expect(testCheckHand([JOKER1])).toBe(Plays.HIGH_CARD);
});

test("Two Jokers should be Pair", () => {
  expect(testCheckHand([JOKER1, JOKER2])).toBe(Plays.PAIR);
});

test("Pair with one card and a joker should work", () => {
  expect(testCheckHand([DK, JOKER2])).toBe(Plays.PAIR);
});

test("Pair with four cards and a joker should work", () => {
  expect(testCheckHand([DK, S7, H4, C2 , JOKER2])).toBe(Plays.PAIR);
});

test("Three Jokers should be ThreeOfAKind should work", () => {
  expect(testCheckHand([JOKER1, JOKER2, JOKER1])).toBe(Plays.THREE_OF_A_KIND);
});

test("ThreeOfAKind with a pair and a joker should work", () => {
  expect(testCheckHand([H2, S2, JOKER1])).toBe(Plays.THREE_OF_A_KIND);
});

test("ThreeOfAKind with two jokers", () => {
  expect(testCheckHand([H2, JOKER1, JOKER1])).toBe(Plays.THREE_OF_A_KIND);
});

test("ThreeOfAKind with three cards and two jokers", () => {
  expect(testCheckHand([H2, S3, D10, JOKER1, JOKER2])).toBe(Plays.THREE_OF_A_KIND);
});

test("Four Jokers should be FourOfAKind", () => {
  expect(testCheckHand([JOKER1, JOKER2, JOKER1, JOKER2])).toBe(Plays.FOUR_OF_A_KIND);
});

test("FourOfAKind with one card should work", () => {
  expect(testCheckHand([C2, JOKER2, JOKER1, JOKER2])).toBe(Plays.FOUR_OF_A_KIND);
});

test("FourOfAKind with two cards should work", () => {
  expect(testCheckHand([C2, D2, JOKER1, JOKER2])).toBe(Plays.FOUR_OF_A_KIND);
});

test("FourOfAKind with three cards should work", () => {
  expect(testCheckHand([C2, D2, H2, JOKER2])).toBe(Plays.FOUR_OF_A_KIND);
});

test("Five Jokers should be FiveOfAKind", () => {
  expect(testCheckHand([JOKER1, JOKER2, JOKER1, JOKER2, JOKER1])).toBe(Plays.FIVE_OF_A_KIND);
});

test("FiveOfAKind with one card should work", () => {
  expect(testCheckHand([H2, JOKER1, JOKER2, JOKER1, JOKER2])).toBe(Plays.FIVE_OF_A_KIND);
});

test("FiveOfAKind with two cards should work", () => {
  expect(testCheckHand([H2, D2, JOKER2, JOKER1, JOKER2])).toBe(Plays.FIVE_OF_A_KIND);
});

test("FiveOfAKind with three cards should work", () => {
  expect(testCheckHand([H2, D2, S2, JOKER1, JOKER2])).toBe(Plays.FIVE_OF_A_KIND);
});

test("FiveOfAKind with four cards should work", () => {
  expect(testCheckHand([H2, D2, S2, C2, JOKER2])).toBe(Plays.FIVE_OF_A_KIND);
});

test("FullHouse with one joker should work", () => {
  expect(testCheckHand([H2, D2, S3, C3, JOKER2])).toBe(Plays.FULL_HOUSE);
});

test("Straight with joker at the end should work", () => {
  expect(testCheckHand([H5, D6, S3, C4, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight ace with a joker at the end should work", () => {
  expect(testCheckHand([HA, D2, S3, C4, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight with one gap and joker should work", () => {
  expect(testCheckHand([H5, D7, S8, C4, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight ace with one gap and a joker should work", () => {
  expect(testCheckHand([HA, D2, S3, C5, JOKER1])).toBe(Plays.STRAIGHT);
});

test("Straight high with one gap and joker should work", () => {
  expect(testCheckHand([HJ, DQ, SK, C10, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight with two jokers at the end should work", () => {
  expect(testCheckHand([H4, D2, S3, JOKER1, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight high with two jokers at the end should work", () => {
  expect(testCheckHand([H10, DJ, S9, JOKER1, JOKER1])).toBe(Plays.STRAIGHT);
});

test("Straight ace with two jokers at the end should work", () => {
  expect(testCheckHand([HA, D2, S3, JOKER1, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight with two gaps and two jokers should work", () => {
  expect(testCheckHand([H4, D7, S3, JOKER1, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight with two gaps and two jokers should work", () => {
  expect(testCheckHand([H4, D7, S8, JOKER1, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight ace with two gaps after ace and two jokers should work", () => {
  expect(testCheckHand([HA, D5, S4, JOKER1, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight ace with two gaps and two jokers should work", () => {
  expect(testCheckHand([HA, D2, S4, JOKER1, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight with two intercalates gaps and two jokers should work", () => {
  expect(testCheckHand([H4, D8, S6, JOKER1, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Straight with two intercalates gaps and two jokers should work", () => {
  expect(testCheckHand([H5, D7, S9, JOKER1, JOKER2])).toBe(Plays.STRAIGHT);
});

test("Flush with three cards and jokers should work", () => {
  expect(testCheckHand([H2, H3, H8, JOKER1, JOKER2])).toBe(Plays.FLUSH);
});

test("Flush with four cards and a joker should work", () => {
  expect(testCheckHand([H2, H3, H8, H9, JOKER2])).toBe(Plays.FLUSH);
});