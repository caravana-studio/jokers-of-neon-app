import { Card } from "../types/Card";
import { Suits } from "../types/Suits";
import { shuffle } from "./shuffle";
import { zeroPad } from "./zeroPad";

export const getInitialDeck = (): Card[] => {
  const deck: Card[] = [];
  ["CLUBS", "DIAMONDS", "HEARTS", "SPADES"].forEach((suit) => {
    for (let i = 1; i <= 13; i++) {
      deck.push({
        suit: suit as unknown as Suits,
        value: i,
        img: `${suit.charAt(0)}${zeroPad(i, 2)}.png`,
      });
    }
  });
  return shuffle(deck);
};
