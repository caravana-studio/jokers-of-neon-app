import { specialCardIds } from "../constants/specialCardIds";
import { CARDS_SUIT_DATA } from "../data/traditionalCards";
import { Cards } from "../enums/cards";
import { ModifiersId } from "../enums/modifiersId";
import { Plays } from "../enums/plays";
import { Suits } from "../enums/suits";
import { Card } from "../types/Card";

const evaluateHand = (
  hand: Card[],
  preSelectedCards: number[],
  specialCards: Card[],
  preSelectedModifiers: { [key: number]: number[] }
): Plays => {
  const specialAllCardsToHearts = specialCards.some((s) => s.card_id === specialCardIds.ALL_TO_HEARTS);
  const easyFlush = specialCards.some((s) => s.card_id === specialCardIds.EASY_FLUSH);
  const easyStraight = specialCards.some((s) => s.card_id === specialCardIds.EASY_STRAIGHT);

  const getNewSuit = (modifierCardId?: number) => {
    switch (modifierCardId) {
      case ModifiersId.SUIT_CLUB_MODIFIER:
        return Suits.CLUBS;
      case ModifiersId.SUIT_DIAMONDS_MODIFIER:
        return Suits.DIAMONDS;
      case ModifiersId.SUIT_HEARTS_MODIFIER:
        return Suits.HEARTS;
      case ModifiersId.SUIT_SPADES_MODIFIER:
        return Suits.SPADES;
      case ModifiersId.WILDCARD_MODIFIER:
        return Suits.WILDCARD;
      default:
        return null;
    }
  };

  const modifyCardData = (card: Card, modifiers: number[]) => {
    if (!card || card.card_id === undefined || card.card_id < 0) return card;

    const cardId = Number(card.card_id);
    const cardSuitData = CARDS_SUIT_DATA[cardId];

    const suit = cardSuitData.suit;
    const rank = CARDS_SUIT_DATA[cardId]?.card;

    let modifiedCardData = {
      ...card,
      card: card.value ?? rank,
      suit: card.suit ?? suit,
      type: "",
    };

    modifiers.forEach((modifierIdx) => {
      const modifierCard = hand.find((mc) => mc.idx === modifierIdx);
      if (modifierCard && modifiedCardData.suit != Suits.JOKER) {
        const newSuit = getNewSuit(modifierCard.card_id);
        if (newSuit) {
          modifiedCardData.suit = newSuit;
        }

        if (modifierCard.card_id === ModifiersId.WILDCARD_MODIFIER)
          modifiedCardData.card = Cards.WILDCARD;
      }
    });

    if (specialAllCardsToHearts) {
      if (
        modifiedCardData.suit != Suits.JOKER &&
        modifiedCardData.suit != Suits.WILDCARD
      ) {
        modifiedCardData.suit = Suits.HEARTS;
      }
    }

    return modifiedCardData;
  };

  let jokers = 0;
  const cardsData = preSelectedCards.reduce<any[]>((acc, card_index) => {
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
    if (card.suit != Suits.JOKER && card.suit != Suits.WILDCARD) {
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

  const isFlush = [
    Suits.CLUBS,
    Suits.DIAMONDS,
    Suits.HEARTS,
    Suits.SPADES,
  ].some((suit) => {
    return (suitsCount.get(suit) || 0) + jokers >= lenFlush;
  });

  let tempJokers = jokers;
  const isStraight = () => {
    if (cardsSorted.length < lenStraight) return false;
    if (cardsSorted.length === lenStraight && jokers === 4) return true;

    const straightValuesMap = new Map<number, boolean>();
    let consecutive = 1;
    let idx = 0;
    let used_ace = 0;
    let bigGap = false;

    while (idx < cardsSorted.length - 1) {
      const actualValue = cardsSorted[idx].card || 0;
      const nextValue = cardsSorted[idx + 1].card || 0;

      if (nextValue === Cards.JOKER || nextValue === Cards.WILDCARD) {
        consecutive++;
        straightValuesMap.set(actualValue, true);
      } else if (actualValue + 1 === nextValue) {
        used_ace += nextValue === Cards.ACE ? 1 : 0;
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
          used_ace += nextValue === Cards.ACE ? 1 : 0;
          consecutive++;
          tempJokers -= gap;
          straightValuesMap.set(actualValue, true);
          straightValuesMap.set(nextValue, true);
        } else {
          bigGap = true;
        }
      }
      idx++;
    }

    if ((valuesCount.get(Cards.ACE) ?? 0) - used_ace > 0) {
      let first_value = cardsSorted[0].card || 0;
      let gap = first_value - 1 - 1;

      if (gap <= tempJokers) {
        consecutive++;
        tempJokers -= gap;
        straightValuesMap.set(Cards.ACE, true);
        straightValuesMap.set(first_value, true);
      }
    }

    if (bigGap && used_ace > 0) {
      return false;
    }

    return consecutive >= lenStraight;
  };
  const isPlayStraight = isStraight();

  if (isFlush && isPlayStraight) {
    let royalCards = [
      Cards.TEN,
      Cards.JACK,
      Cards.QUEEN,
      Cards.KING,
      Cards.ACE,
    ];

    let foundValues = 0;
    for (let idx = 0; idx < cardsSorted.length; idx++) {
      const card = cardsSorted[idx];
      if (card.card != undefined && royalCards.includes(card.card)) {
        foundValues += 1;
      }
    }

    if (foundValues + jokers === 5) return Plays.ROYAL_FLUSH;
    else return Plays.STRAIGHT_FLUSH;
  }

  const isFiveOfAKind = counts.some(
    (cardValue) => (valuesCount.get(cardValue) || 0) + jokers === 5
  );
  if (isFiveOfAKind) {
    return Plays.FIVE_OF_A_KIND;
  }

  const isFourOfAKind = counts.some(
    (cardValue) => (valuesCount.get(cardValue) || 0) + jokers === 4
  );
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
    return (
      (pairsCount === 1 && isThreeOfAKind) || (pairsCount === 2 && jokers === 1)
    );
  })();

  if (isFullHouse) {
    return Plays.FULL_HOUSE;
  }

  if (isPlayStraight) {
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

  const isOnePair = counts.some(
    (cardValue) => (valuesCount.get(cardValue) || 0) + jokers == 2
  );
  if (isOnePair) {
    return Plays.PAIR;
  }

  return Plays.HIGH_CARD;
};

export interface HandResult {
  play: Plays;
  isNeon: boolean;
}

export const checkHand = (
  hand: Card[],
  preSelectedCards: number[],
  specialCards: Card[],
  preSelectedModifiers: { [key: number]: number[] }
): HandResult => {
  const play = evaluateHand(hand, preSelectedCards, specialCards, preSelectedModifiers);

  // Check if all preselected cards are neon
  const selectedCards = preSelectedCards.map(cardIdx =>
    hand.find(c => c.idx === cardIdx)
  ).filter((card): card is Card => card !== undefined);

  // A play is neon if all selected cards (excluding jokers/wildcards) are neon cards
  const isNeon = selectedCards.length > 0 && selectedCards.every(card => {
    // Jokers and wildcards don't affect neon status
    if (card.suit === Suits.JOKER || card.suit === Suits.WILDCARD) {
      return true;
    }

    // Check if card has neon modifier applied
    const modifiers = preSelectedModifiers[card.idx] ?? [];
    const hasNeonModifier = modifiers.some(modifierIdx => {
      const modifierCard = hand.find(c => c.idx === modifierIdx);
      return modifierCard?.card_id === ModifiersId.NEON_MODIFIER;
    });

    return card.isNeon === true || hasNeonModifier;
  });

  return {
    play,
    isNeon
  };
};
