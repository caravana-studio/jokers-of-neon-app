import { CairoCustomEnum } from "starknet";
import { Card } from "../types/Card";

export const getCardType = (card: Card): CairoCustomEnum => {
  return new CairoCustomEnum({
    None: undefined,
    Common: !card.isModifier ? "" : undefined,
    Modifier: card.isModifier ? "" : undefined,
  });
};
