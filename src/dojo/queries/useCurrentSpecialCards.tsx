import { getComponentValue } from "@dojoengine/recs";
import { Entity } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Card } from "../../types/Card";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";

const getSpecialCard = (
  gameId: number,
  index: number,
  CurrentSpecialCards: any
) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(index),
  ]) as Entity;
  const specialCard = getComponentValue(CurrentSpecialCards, entityId);
  const card_id = specialCard?.effect_card_id;
  if (!card_id || !specialCard) return;
  return {
    card_id,
    isSpecial: true,
    id: card_id.toString(),
    idx: index,
    img: `effect/${card_id}.png`,
  };
};

export const useCurrentSpecialCards = (): Card[] => {
  const game = useGame();
  const {
    setup: {
      clientComponents: { CurrentSpecialCards },
    },
  } = useDojo();
  if (!game) return [];
  const gameId = game.id ?? 0;
  const length = game.len_current_special_cards ?? 0;

  let specialCards = [];
  for (let i = 0; i < length; i++) {
    const card = getSpecialCard(gameId, i, CurrentSpecialCards);
    card && specialCards.push(card);
  }
  return specialCards;
};
