import { Plays } from "../enums/plays";
import { Suits } from "../enums/suits";
import { Card } from "../types/Card";
import { CardData } from "../types/CardData";
import { getCardData } from "./getCardData";
import { Cards } from "../enums/cards";

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


  let jokers = 0;
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
  const cardsSorted = [...cardsData].sort((a, b) => (a.card || 0) - (b.card || 0));

  for (const card of cardsSorted) {
    if (card.suit != Suits.JOKER) {
      const valueCount = valuesCount.get(card.card || 0) || 0;
      const suitCount = suitsCount.get(card.suit as Suits) || 0;

      if (valueCount === 0) {
        counts.push(card.card || 0);
      }

      valuesCount.set(card.card || 0, valueCount + 1);
      suitsCount.set(card.suit as Suits, suitCount + 1);
    } else {
      jokers += 1;
    }
  }

  const lenFlush = easyFlush ? 4 : 5;
  const lenStraight = easyStraight ? 4 : 5;

  if (cardsData.length === jokers) {
    switch (jokers) {
      case 5:
        return Plays.ROYAL_FLUSH;
      case 4:
        return Plays.FOUR_OF_A_KIND;
      case 3:
        return Plays.THREE_OF_A_KIND;
      case 2:
        return Plays.PAIR;
      default:
        return Plays.HIGH_CARD;
    }
  }

  const isFlush = [Suits.CLUBS, Suits.DIAMONDS, Suits.HEARTS, Suits.SPADES].some(
    (suit) => {
      return (suitsCount.get(suit) || 0) + jokers >= lenFlush;
    }
  );

  let tempJokers = jokers;
  const isStraight = () => {
    if (cardsSorted.length < lenStraight) return false;
    if (cardsSorted.length === lenStraight && jokers === 4) return true;

    const straightValuesMap = new Map<number, boolean>();
    let consecutive = 1;
    let idx = 0;

    while (idx < cardsSorted.length - 1) {
      const actualValue = cardsSorted[idx].card || 0;
      const nextValue = cardsSorted[idx + 1].card || 0;

      if (nextValue === Cards.JOKER) {
        consecutive++;
        straightValuesMap.set(actualValue, true);
      } else if (actualValue + 1 === nextValue) {
        consecutive++;
        straightValuesMap.set(actualValue, true);
        straightValuesMap.set(nextValue, true);
      } else {
        if (actualValue === nextValue) {
          idx++;
          continue;
        }

        const gap = nextValue - actualValue - 1;
        if (gap <= tempJokers) {
          consecutive++;
          tempJokers -= gap;
          straightValuesMap.set(actualValue, true);
          straightValuesMap.set(nextValue, true);
        }
      }
      idx++;
    }

    if (valuesCount.get(Cards.ACE)) {
      let first_value = cardsSorted[0].card || 0;
      let gap = first_value - 1 - 1;

      if (gap <= tempJokers) {
        consecutive++;
        tempJokers -= gap;
        straightValuesMap.set(Cards.ACE, true);
        straightValuesMap.set(first_value, true);
      }
    }

    return consecutive >= lenStraight;
  };

  if (isFlush && isStraight()) {
    let royalCards = [Cards.TEN, Cards.JACK, Cards.QUEEN, Cards.KING, Cards.ACE]

    let foundValues = 0;
    for (let idx = 0; idx < cardsSorted.length; idx++) {
      const card = cardsSorted[idx];
      if (card.card !=  undefined && royalCards.includes(card.card)) {
        foundValues += 1;
      }
    }

    if ( foundValues + jokers === lenStraight)
      return Plays.ROYAL_FLUSH;
    else
      return Plays.STRAIGHT_FLUSH;
  }

  const isFiveOfAKind = counts.some((cardValue) => (valuesCount.get(cardValue) || 0) + jokers === 5);
  if (isFiveOfAKind) {
    return Plays.FIVE_OF_A_KIND;
  }

  const isFourOfAKind = counts.some((cardValue) => (valuesCount.get(cardValue) || 0) + jokers === 4);
  if (isFourOfAKind) {
    return Plays.FOUR_OF_A_KIND;
  }
  
  const isFullHouse = (() => {
    let pairsCount = 0;
    let isThreeOfAKind = false;
    counts.forEach((cardValue) => {
      const count = valuesCount.get(cardValue) || 0;
      if (count === 2) pairsCount += 1;
      if (count === 3) isThreeOfAKind = true;
    });
    return (pairsCount === 1 && isThreeOfAKind) || (pairsCount === 2 && jokers === 1);
  })();

  if (isFullHouse) {
    return Plays.FULL_HOUSE;
  }

  if (isStraight()) {
    return Plays.STRAIGHT;
  }

  if (isFlush) {
    return Plays.FLUSH;
  }

  const isThreeOfAKind = counts.some((cardValue) => {
    const countWithJokers = (valuesCount.get(cardValue) || 0) + jokers;
    return countWithJokers === 3;
  });
  
  if (isThreeOfAKind) {
    return Plays.THREE_OF_A_KIND;
  }

  const isTwoPair = (() => {
    let pairsCount = 0;
    counts.forEach((cardValue) => {
      const count = valuesCount.get(cardValue) || 0;
      if (count === 2) {
        pairsCount += 1;
      }
    });
    return pairsCount === 2;
  })();

  if (isTwoPair) {
    return Plays.TWO_PAIR;
  }

  const isOnePair = counts.some((cardValue) => (valuesCount.get(cardValue) || 0) + jokers == 2);
  if (isOnePair) {
    return Plays.PAIR;
  }

  return Plays.HIGH_CARD;
};
