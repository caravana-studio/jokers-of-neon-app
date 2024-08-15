import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { testCheckHand } from "../../../testUtils/testCheckHand";
import { C5, D10, D2, D3, D4, D5, D6, D8, D9, DK, H10, H2, H3, H4, H6, H7, H9, HA, HJ, HK, HQ, JOKER1, JOKER2, S10, S3 } from "../../mocks/cardMocks";
import { EasyFlush, AllCardsToHearts, EasyStraight } from "../../mocks/specialCardMocks";

test("Flush with EasyFlush should work", () => {
  expect(testCheckHand([H2, H3, H4, H9, S10], [EasyFlush])).toBe(Plays.FLUSH);
  });

test("Flush with EasyFlush and a joker should work", () => {
  expect(testCheckHand([H2, H3, H4, JOKER1], [EasyFlush])).toBe(Plays.FLUSH);
  });

test("Flush with EasyFlush and two jokers should work", () => {
  expect(testCheckHand([H2, H3, JOKER2, JOKER1], [EasyFlush])).toBe(Plays.FLUSH);
  });

test("Flush with AllCardsToHearts should work", () => {
  expect(testCheckHand([H2, H3, H4, D10, S3], [AllCardsToHearts])).toBe(Plays.FLUSH);
  });

test("Flush with AllCardsToHearts and a joker should work", () => {
  expect(testCheckHand([H2, H3, H4, D10, JOKER2], [AllCardsToHearts])).toBe(Plays.FLUSH);
  });

test("Flush with EasyFlush and AllCardsToHearts should work", () => {
  expect(testCheckHand([H2, H3, H4, D10], [EasyFlush, AllCardsToHearts])).toBe(Plays.FLUSH);
  });

test("Flush with EasyFlush and AllCardsToHearts and a joker should work", () => {
  expect(testCheckHand([H2, H3, H4, JOKER1], [EasyFlush, AllCardsToHearts])).toBe(Plays.FLUSH);
  });

test("Straight with EasyStraight should work", () => {
  expect(testCheckHand([H2, H3, H4, D5], [EasyStraight])).toBe(Plays.STRAIGHT);
  });

test("Straight with EasyStraight first cards should work", () => {
  expect(testCheckHand([H3, H4, D5, D6, S10], [EasyStraight])).toBe(Plays.STRAIGHT);
  });

test("Straight with EasyStraight last cards should work", () => {
  expect(testCheckHand([H3, H7, D8, D9, S10], [EasyStraight])).toBe(Plays.STRAIGHT);
  });

test("Straight with EasyStraight and a gap filled with joker should work", () => {
  expect(testCheckHand([H6, H3, H4, JOKER1], [EasyStraight])).toBe(Plays.STRAIGHT);
  });

test("Straight with EasyStraight and gaps filled with two jokers should work", () => {
  expect(testCheckHand([H6, D3, JOKER2, JOKER1], [EasyStraight])).toBe(Plays.STRAIGHT);
  });

test("Straight with EasyStraight and gap filled with jokers at the end should work", () => {
  expect(testCheckHand([H4, C5, JOKER2, JOKER1], [EasyStraight])).toBe(Plays.STRAIGHT);
  });

test("StraightFlush with EasyStraight and EasyFlush should work", () => {
  expect(testCheckHand([D2, D3, D4, D5], [EasyStraight, EasyFlush])).toBe(Plays.STRAIGHT_FLUSH);
  });

test("RoyalFlush with EasyStraight and EasyFlush should work", () => {
  expect(testCheckHand([HA, HJ, HQ, HK], [EasyStraight, EasyFlush])).toBe(Plays.ROYAL_FLUSH);
  });

test("RoyalFlush with EasyStraight and EasyFlush and a gap should work", () => {
  expect(testCheckHand([HA, HJ, HQ, JOKER1], [EasyStraight, EasyFlush])).toBe(Plays.ROYAL_FLUSH);
  });

  test("RoyalFlush with EasyStraight and EasyFlush and two gaps should work", () => {
    expect(testCheckHand([HA, HJ, JOKER2, JOKER1], [EasyStraight, EasyFlush])).toBe(Plays.ROYAL_FLUSH);
    });

test("StraightFlush with EasyStraight, EasyFlush and AllCardsToHearts should work", () => {
  expect(testCheckHand([H2, H3, H4, D5], [EasyStraight, EasyFlush, AllCardsToHearts])).toBe(Plays.STRAIGHT_FLUSH);
  });

test("RoyalFlush with EasyStraight, EasyFlush and AllCardsToHearts should work", () => {
  expect(testCheckHand([HA, HJ, HQ, HK], [EasyStraight, EasyFlush, AllCardsToHearts])).toBe(Plays.ROYAL_FLUSH);
  });
