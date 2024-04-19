import { Card } from "../types/Card";
import { Plays } from "../types/Plays";

export const calculatePlay = (cards: Card[]) => {
  if (!cards || cards.length === 0) {
    return Plays.NONE;
  }

  if (cards.length === 1) {
    return Plays.HIGH_CARD;
  }
  // Sort cards by value
  cards.sort((a, b) => a.value - b.value);

  const numCards = cards.length;

  // Check for flush
  const isFlush = cards.every((card) => card.suit === cards[0].suit);

  // Check for straight
  const isStraight =
    numCards >= 5 &&
    cards.every((card, index) => {
      if (index === 0) return true;
      return card.value === cards[index - 1]?.value + 1;
    });

  // Check for straight flush and royal flush
  if (isFlush && isStraight) {
    if (cards[numCards - 1]?.value === 13 && cards[numCards - 5]?.value === 1)
      return Plays.ROYAL_FLUSH;
    return Plays.STRAIGHT_FLUSH;
  }

  // Check for four of a kind
  if (
    numCards >= 4 &&
    cards[0]?.value === cards[1]?.value &&
    cards[1]?.value === cards[2]?.value &&
    cards[2]?.value === cards[3]?.value &&
    cards[3]?.value === cards[4]?.value
  )
    return Plays.FOUR_OF_A_KIND;

  // Check for full house
  if (
    numCards >= 5 &&
    ((cards[0]?.value === cards[1]?.value &&
      cards[2]?.value === cards[3]?.value &&
      cards[3]?.value === cards[4]?.value) ||
      (cards[0]?.value === cards[1]?.value &&
        cards[1]?.value === cards[2]?.value &&
        cards[3]?.value === cards[4]?.value))
  )
    return Plays.FULL_HOUSE;

  // Check for flush
  if (isFlush) return Plays.FLUSH;

  // Check for straight
  if (isStraight) return Plays.STRAIGHT;

  // Check for three of a kind
  if (
    numCards >= 3 &&
    cards.some(
      (card, index) =>
        index <= numCards - 3 &&
        cards[index]?.value === cards[index + 1]?.value &&
        cards[index + 1]?.value === cards[index + 2]?.value
    )
  )
    return Plays.THREE_OF_A_KIND;

  // Check for two pairs
  if (
    numCards >= 4 &&
    ((cards[0]?.value === cards[1]?.value &&
      cards[2]?.value === cards[3]?.value) ||
      (cards[0]?.value === cards[1]?.value &&
        cards[3]?.value === cards[4]?.value) ||
      (cards[1]?.value === cards[2]?.value &&
        cards[3]?.value === cards[4]?.value))
  )
    return Plays.TWO_PAIR;

  // Check for pair
  if (
    numCards >= 2 &&
    cards.some(
      (card, index) =>
        index <= numCards - 2 && cards[index]?.value === cards[index + 1]?.value
    )
  )
    return Plays.PAIR;

  // If none of the above, return high card
  return Plays.HIGH_CARD;
};
