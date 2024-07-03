import { CardData } from "../types/CardData";
import { Plays } from "../enums/plays";
import { Suits } from "../enums/suits";

export const checkHand = (cards: CardData[], easyFlush: boolean, easyStraigh: boolean): Plays => {
    const valuesCount = new Map<number, number>();
    const suitsCount = new Map<Suits, number>();
    const counts: number[] = [];

    const cardsSorted = [...cards].sort((a, b) => (a.card || 0) - (b.card || 0));

    for (const card of cardsSorted) {
        const valueCount = valuesCount.get(card.card || 0) || 0;
        const suitCount = suitsCount.get(card.suit as Suits) || 0;

        if (valueCount === 0) {
            counts.push(card.card || 0);
        }

        valuesCount.set(card.card || 0, valueCount + 1);
        suitsCount.set(card.suit as Suits, suitCount + 1);
    }

    const countCardFlush = easyFlush ? 4 : 5;
    const isFlush = [Suits.CLUBS, Suits.DIAMONDS, Suits.HEARTS, Suits.SPADES].some(
        suit => (suitsCount.get(suit) || 0) >= countCardFlush
    );

    const countCardStraight = easyStraigh ? 4 : 5;
    const isStraight = cardsSorted.length >= countCardStraight &&
        cardsSorted.every((card, idx, arr) =>
            idx === 0 || (card.card || 0) === ((arr[idx - 1].card || 0) + 1)
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

    let hand: Plays;
    if (isStraight && isFlush) {
        hand = Plays.STRAIGHT_FLUSH;
    } else if (isFiveOfAKind) {
        hand = Plays.FIVE_OF_A_KIND;
    } else if (isFourOfAKind) {
        hand = Plays.FOUR_OF_A_KIND;
    } else if (isThreeOfAKind && pairsCount === 1) {
        hand = Plays.FULL_HOUSE;
    } else if (isStraight) {
        hand = Plays.STRAIGHT;
    } else if (isFlush) {
        hand = Plays.FLUSH;
    } else if (isThreeOfAKind) {
        hand = Plays.THREE_OF_A_KIND;
    } else if (pairsCount === 2) {
        hand = Plays.TWO_PAIR;
    } else if (pairsCount === 1) {
        hand = Plays.PAIR;
    } else {
        hand = Plays.HIGH_CARD;
    }
    return hand;
};