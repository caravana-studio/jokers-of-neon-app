import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { testCheckHand } from "../../../testUtils/testCheckHand";
import { C2, D2, H2, S2 } from "../../mocks/cardMocks";

test("HighCard should work", () => {
  expect(testCheckHand([H2], [], [])).toBe(Plays.HIGH_CARD);
});

test("Pair should work", () => {
  expect(testCheckHand([H2, C2], [], [])).toBe(Plays.PAIR);
});

test("ThreeOfAKind should work", () => {
  expect(testCheckHand([H2, C2, D2], [], [])).toBe(Plays.THREE_OF_A_KIND);
});

test("FourOfAKind should work", () => {
  expect(testCheckHand([H2, C2, D2, S2], [], [])).toBe(Plays.FOUR_OF_A_KIND);
});

test("FiveOfAKind should work", () => {
  expect(testCheckHand([H2, C2, D2, S2, H2], [], [])).toBe(Plays.FIVE_OF_A_KIND);
});
