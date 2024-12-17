import { Suits } from "../enums/suits";
import { changeCardNeon } from "./changeCardNeon";
import { changeCardSuit } from "./changeCardSuit";
import { changeWildcard } from "./changeWildcard";

const modifierTransformations: Record<number, {
  transform: (...args: any[]) => any;
  args: any[];
}> = {
  608: {
    transform: changeCardSuit,
    args: [Suits.CLUBS],
  },
  609: {
    transform: changeCardSuit,
    args: [Suits.DIAMONDS],
  },
  610: {
    transform: changeCardSuit,
    args: [Suits.HEARTS],
  },
  611: {
    transform: changeCardSuit,
    args: [Suits.SPADES],
  },
  612: {
    transform: changeCardNeon,
    args: [],
  },
  613: {
    transform: changeWildcard,
    args: [],
  }
};

export const transformCardByModifierId = (modifierId: number, modifiedCardId: number) => {
  const transformation = modifierTransformations[modifierId];

  if (!transformation) {
    console.log(`No transformation found for modifierId: ${modifierId}`);
    return -1;
  }

  const { transform, args } = transformation;

  return transform(modifiedCardId, ...args);
  };
  