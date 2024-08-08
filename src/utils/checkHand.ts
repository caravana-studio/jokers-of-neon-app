import { Plays } from "../enums/plays";
import { Suits } from "../enums/suits";
import { Card } from "../types/Card";
import { CardData } from "../types/CardData";
import { getCardData } from "./getCardData";

export const checkHand = (
  hand: Card[],
  preSelectedCards: number[],
  specialCards: Card[],
  preSelectedModifiers: { [key: number]: number[] }
): Plays => {
  const specialAllCardsToHearts = specialCards.some((s) => s.card_id === 15);
  const easyFlush = specialCards.some((s) => s.card_id === 10);
  const easyStraight = specialCards.some((s) => s.card_id === 9);

  const getNewSuit = (modifierCardId?: number) => {
    switch (modifierCardId) {
      case 25:
        return Suits.CLUBS;
      case 26:
        return Suits.DIAMONDS;
      case 27:
        return Suits.HEARTS;
      case 28:
        return Suits.SPADES;
      default:
        return null;
    }
  };

  const modifyCardData = (card: Card, modifiers: number[]) => {
    let modifiedCardData = { ...getCardData(card) };

    modifiers.forEach((modifierIdx) => {
      const modifierCard = hand.find((mc) => mc.idx === modifierIdx);
      if (modifierCard) {
        const newSuit = getNewSuit(modifierCard.card_id);
        if (newSuit) {
          modifiedCardData.suit = newSuit;
        }
      }
    });

    if (specialAllCardsToHearts) {
      modifiedCardData.suit = Suits.HEARTS;
    }

    return modifiedCardData;
  };

  const cardsData = preSelectedCards.reduce<CardData[]>((acc, card_index) => {
    const card = hand.find((c) => c.idx === card_index);
    if (card) {
      const modifiers = preSelectedModifiers[card_index] ?? [];
      const modifiedCardData = modifyCardData(card, modifiers);
      acc.push(modifiedCardData);
    }
    return acc;
  }, []);

  const valuesCount = new Map<number, number>();
  const suitsCount = new Map<Suits, number>();
  const counts: number[] = [];

  const cardsSorted = [...cardsData].sort(
    (a, b) => (a.card || 0) - (b.card || 0)
  );

  for (const card of cardsSorted) {
    if (card.suit != Suits.JOKER) {
      const valueCount = valuesCount.get(card.card || 0) || 0;
      const suitCount = suitsCount.get(card.suit as Suits) || 0;

      if (valueCount === 0) {
        counts.push(card.card || 0);
      }

      valuesCount.set(card.card || 0, valueCount + 1);
      suitsCount.set(card.suit as Suits, suitCount + 1);
    }
  }

  const countCardFlush = easyFlush ? 4 : 5;
  const isFlush = [
    Suits.CLUBS,
    Suits.DIAMONDS,
    Suits.HEARTS,
    Suits.SPADES,
  ].some((suit) => (suitsCount.get(suit) || 0) >= countCardFlush);

  const countCardStraight = easyStraight ? 4 : 5;
  const isStraight =
    cardsSorted.length >= countCardStraight &&
    cardsSorted.every(
      (card, idx, arr) =>
        idx === 0 || (card.card || 0) === (arr[idx - 1].card || 0) + 1
    );

  let isFiveOfAKind = false;
  let isFourOfAKind = false;
  let isThreeOfAKind = false;
  let pairsCount = 0;
  const cardsSumValue: number[] = [];

  for (const cardValue of counts) {
    const count = valuesCount.get(cardValue) || 0;

    if (count === 5) {
      isFiveOfAKind = true;
      cardsSumValue.push(cardValue);
    } else if (count === 4) {
      isFourOfAKind = true;
      cardsSumValue.push(cardValue);
    } else if (count === 3) {
      isThreeOfAKind = true;
      cardsSumValue.push(cardValue);
    } else if (count === 2) {
      pairsCount += 1;
      cardsSumValue.push(cardValue);
    }
  }

  let play: Plays;
  if (isStraight && isFlush) {
    play = Plays.STRAIGHT_FLUSH;
  } else if (isFiveOfAKind) {
    play = Plays.FIVE_OF_A_KIND;
  } else if (isFourOfAKind) {
    play = Plays.FOUR_OF_A_KIND;
  } else if (isThreeOfAKind && pairsCount === 1) {
    play = Plays.FULL_HOUSE;
  } else if (isStraight) {
    play = Plays.STRAIGHT;
  } else if (isFlush) {
    play = Plays.FLUSH;
  } else if (isThreeOfAKind) {
    play = Plays.THREE_OF_A_KIND;
  } else if (pairsCount === 2) {
    play = Plays.TWO_PAIR;
  } else if (pairsCount === 1) {
    play = Plays.PAIR;
  } else {
    play = Plays.HIGH_CARD;
  }
  return play;
};
