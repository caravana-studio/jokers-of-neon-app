import { CardDataMap } from "../types/CardData";

export const PACKS_DATA: CardDataMap = {
  1: {
    name: "Basic Pack",
    description: "Contains mostly traditional cards and modifiers",
    details:
      "2% chance of getting a special card\n5% chance of getting a joker\n5% chance of getting a modifier\nPack size 5",
  },
  2: {
    name: "Advanced Pack",
    description: "Can contain a special card or joker",
    details:
      "4% chance of getting a special card\n10% chance of getting a joker\n10% chance of getting a modifier\nPack size 5",
  },
  3: {
    name: "Jokers Pack",
    description: "More chances of getting a Joker",
    details: "30% chance of getting a joker\nPack size 5",
  },
  4: {
    name: "Specials Pack",
    description: "More chances of getting a special card",
    details:
      "20% chance of getting a special card\n20% chance of getting a modifier\nPack size 3",
  },
  5: {
    name: "Modifiers Pack",
    description: "Contains mostly modifiers",
    details: "50% chance of getting a modifier\nPack size 5",
  },
  6: {
    name: "Figures Pack",
    description: "Contains mostly figure cards",
    details: "70% chance of getting a figure\nPack size 5",
  },
  7: {
    name: "The deceitful Joker Pack",
    description: "1 guaranteed joker",
    details:
      "1 guaranteed joker\n1% chance of getting a Neon Joker\nPack size 4",
  },
  8: {
    name: "The lovers Pack",
    description:
      "All hearts suited cards, can contain special cards and modifiers.",
    details:
      "100% heart suited cards \n5% chance of getting a special card\n10% chance of getting heart suit modifier.\nPack size 4",
  },
  9: {
    name: "Special bet Pack",
    description:
      "Small pack with chances of getting a special card or modifier",
    details:
      "5% chance of getting a special card\n10% chance of getting a modifier\nPack size 3",
  },
};
