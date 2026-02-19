import { expect, test } from "vitest";
import { Plays } from "../../../enums/plays";
import { Card } from "../../../types/Card";
import { getCardsComposingPlay } from "../../checkHand";
import {
  C2,
  C3,
  C4,
  C5,
  C6,
  C9,
  C10,
  CA,
  CK,
  CQ,
  D2,
  D3,
  D7,
  D9,
  DA,
  H5,
  H6,
  H2,
  H3,
  H4,
  H7,
  H8,
  H9,
  H10,
  HA,
  HJ,
  HK,
  HQ,
  JOKER1,
  S7,
  S9,
} from "../../mocks/cardMocks";
import { WildcardModifier } from "../../mocks/modifierMocks";
import { EasyFlush, EasyStraight } from "../../mocks/specialCardMocks";

const withIdx = (cards: Card[]): Card[] =>
  cards.map((card, index) => ({ ...card, idx: index, id: `${card.id}-${index}` }));

test("returns empty when no cards are selected", () => {
  const hand = withIdx([H7, D7, CA]);
  expect(
    getCardsComposingPlay(hand, [], [], {}, Plays.PAIR)
  ).toEqual([]);
});

test("returns all selected cards when minimum cards equals selected cards", () => {
  const hand = withIdx([H7, D7]);
  expect(
    getCardsComposingPlay(hand, [0, 1], [], {}, Plays.PAIR)
  ).toEqual([0, 1]);
});

test("selects only the pair cards when extra kickers are selected", () => {
  const hand = withIdx([H7, D7, CA, CK, CQ]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4], [], {}, Plays.PAIR)
  ).toEqual([0, 1]);
});

test("selects only two-pair cards and excludes kicker", () => {
  const hand = withIdx([H7, D7, H2, C2, CA]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4], [], {}, Plays.TWO_PAIR)
  ).toEqual([0, 1, 2, 3]);
});

test("selects only three-of-a-kind cards and excludes kicker", () => {
  const hand = withIdx([H7, D7, C9, S9]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3], [], {}, Plays.PAIR)
  ).toEqual([2, 3]);
});

test("selects straight cards and excludes non-straight card", () => {
  const hand = withIdx([H2, C3, H4, C5, C6, H9]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4, 5], [], {}, Plays.STRAIGHT)
  ).toEqual([4, 3, 2, 1, 0]);
});

test("selects flush cards and excludes off-suit card", () => {
  const hand = withIdx([H2, H3, H4, H8, H9, S9]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4, 5], [], {}, Plays.FLUSH)
  ).toEqual([4, 3, 2, 1, 0]);
});

test("with EasyFlush selects 4-card flush composition", () => {
  const hand = withIdx([H2, H3, H4, H8, S9]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4], [EasyFlush], {}, Plays.FLUSH)
  ).toEqual([3, 2, 1, 0]);
});

test("with EasyStraight selects 4-card straight composition", () => {
  const hand = withIdx([C2, C3, C4, C5, H9]);
  expect(
    getCardsComposingPlay(
      hand,
      [0, 1, 2, 3, 4],
      [EasyStraight],
      {},
      Plays.STRAIGHT
    )
  ).toEqual([3, 2, 1, 0]);
});

test("handles jokers by selecting real high card for HIGH_CARD play", () => {
  const hand = withIdx([JOKER1, CA, H7]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2], [], {}, Plays.HIGH_CARD)
  ).toEqual([1]);
});

test("considers wildcard modifiers when composing the play", () => {
  const hand = withIdx([H2, C2, C3, S9, WildcardModifier]);
  expect(
    getCardsComposingPlay(
      hand,
      [0, 1, 2, 3],
      [],
      { 2: [4] },
      Plays.THREE_OF_A_KIND
    )
  ).toEqual([2, 0, 1]);
});

test("falls back to all selected cards when requested play is not found", () => {
  const hand = withIdx([H7, D7, CA, CK, CQ]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4], [], {}, Plays.FLUSH)
  ).toEqual([0, 1, 2, 3, 4]);
});

test("for pair play picks the highest available pair from multiple pairs", () => {
  const hand = withIdx([H2, C2, H7, S7, CA]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4], [], {}, Plays.PAIR)
  ).toEqual([2, 3]);
});

test("selects only four-of-a-kind cards from a larger selection", () => {
  const hand = withIdx([C9, D9, H9, S9, CA, CK]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4, 5], [], {}, Plays.FOUR_OF_A_KIND)
  ).toEqual([0, 1, 2, 3]);
});

test("selects full house cards and excludes higher kicker", () => {
  const hand = withIdx([CA, H7, D7, S7, H2, D2]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4, 5], [], {}, Plays.FULL_HOUSE)
  ).toEqual([1, 2, 3, 4, 5]);
});

test("selects straight flush cards from 6 selected cards", () => {
  const hand = withIdx([H5, H6, H7, H8, H9, CA]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4, 5], [], {}, Plays.STRAIGHT_FLUSH)
  ).toEqual([4, 3, 2, 1, 0]);
});

test("selects royal flush cards when extra non-royal card is selected", () => {
  const hand = withIdx([H10, HJ, HQ, HK, HA, C2]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4, 5], [], {}, Plays.ROYAL_FLUSH)
  ).toEqual([4, 3, 2, 1, 0]);
});

test("selects five-of-a-kind cards using joker and excludes extra card", () => {
  const hand = withIdx([C9, D9, H9, S9, JOKER1, CA]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4, 5], [], {}, Plays.FIVE_OF_A_KIND)
  ).toEqual([0, 1, 2, 3, 4]);
});

test("for high-card play picks highest non-joker card from larger selection", () => {
  const hand = withIdx([JOKER1, C9, CK, CA]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3], [], {}, Plays.HIGH_CARD)
  ).toEqual([3]);
});

test("supports ace-low straight extraction from larger selection", () => {
  const hand = withIdx([CA, C2, D3, C4, H5, H9]);
  expect(
    getCardsComposingPlay(hand, [0, 1, 2, 3, 4, 5], [], {}, Plays.STRAIGHT)
  ).toEqual([0, 4, 3, 2, 1]);
});

test("with EasyFlush and EasyStraight selects 4-card straight flush composition", () => {
  const hand = withIdx([H2, H3, H4, H5, C9]);
  expect(
    getCardsComposingPlay(
      hand,
      [0, 1, 2, 3, 4],
      [EasyFlush, EasyStraight],
      {},
      Plays.STRAIGHT_FLUSH
    )
  ).toEqual([3, 2, 1, 0]);
});
