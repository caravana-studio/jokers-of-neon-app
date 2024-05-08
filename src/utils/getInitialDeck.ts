import { Suits } from "../enums/suits";
import { Card } from "../types/Card";
import { shuffle } from "./shuffle";
import { zeroPad } from "./zeroPad";

export const getInitialDeck = (): Card[] => {
  const deck: Card[] = [];
  [1, 2, 3, 4].forEach((suit) => {
    for (let i = 1; i <= 13; i++) {
      deck.push({
        suit,
        value: i,
        img: `${Suits[suit].charAt(0)}${zeroPad(i, 2)}.png`,
      });
    }
  });
  return shuffle(deck);
};
