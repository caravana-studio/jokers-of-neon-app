import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { testCheckHand } from "../../../testUtils/testCheckHand";
import { JOKER1, JOKER2 } from "../../mocks/cardMocks";

test("One Joker should be high card", () => {
  expect(testCheckHand([JOKER1])).toBe(Plays.HIGH_CARD);
});

test("Two Jokers should be Pair", () => {
  expect(testCheckHand([JOKER1, JOKER2])).toBe(Plays.PAIR);
});

test("Three Jokers should be ThreeOfAKind", () => {
  expect(testCheckHand([JOKER1, JOKER2, JOKER1])).toBe(Plays.THREE_OF_A_KIND);
});

test("Four Jokers should be FourOfAKind", () => {
  expect(testCheckHand([JOKER1, JOKER2, JOKER1, JOKER2])).toBe(Plays.FOUR_OF_A_KIND);
});

test("Five Jokers should be FiveOfAKind", () => {
  expect(testCheckHand([JOKER1, JOKER2, JOKER1, JOKER2, JOKER1])).toBe(Plays.FIVE_OF_A_KIND);
});

