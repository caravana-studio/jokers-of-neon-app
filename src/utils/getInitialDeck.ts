import { Suits } from "../enums/suits";
import { Card } from "../types/Card";
import { shuffle } from "./shuffle";
import { zeroPad } from "./zeroPad";

const modifier1 = {
  img: "Joker1.png",
  name: "modifier 1",
  isModifier: true,
};
const modifier2 = {
  img: "Joker2.png",
  name: "modifier 2",
  isModifier: true,
};

export const getInitialDeck = (): Card[] => {
  const deck: Card[] = [];
  [1, 2, 3, 4].forEach((suit) => {
    for (let i = 1; i <= 13; i++) {
      const newPokerCard = {
        id: `${Suits[suit].charAt(0)}${zeroPad(i, 2)}`,
        suit,
        value: i,
        img: `${Suits[suit].charAt(0)}${zeroPad(i, 2)}.png`,
      };
      deck.push(newPokerCard);
    }
  });

  const times = 20;

  for (let i = 0; i < times; i++) {
    deck.push({ ...modifier1, id: `modifier1-${i}` });
    deck.push({ ...modifier2, id: `modifier2-${i}` });
  }

  return shuffle(deck);
};
