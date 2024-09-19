import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "../useDojo.tsx";
import { useGame } from "./useGame.tsx";

export const useRageRound = () => {
  const {
    setup: {
      clientComponents: { RageRound },
    },
  } = useDojo();
  const game = useGame();

  const gameId = game?.id ?? 0;

  console.log("gameId", gameId);
  const entityId = getEntityIdFromKeys([BigInt(gameId)]) as Entity;
  console.log("entityId", entityId);
  console.log("rageRound", RageRound);
  return useComponentValue(RageRound, entityId);
};

export const useRageCards = () => {
  const rageRound = useRageRound();
  if (!rageRound || !rageRound.is_active || !rageRound.active_rage_ids) {
    return [];
  }
  return rageRound.active_rage_ids.map((card_id, index) => {
    return {
      card_id,
      isSpecial: false,
      id: card_id?.toString(),
      idx: index ?? 0,
      img: `rage/${card_id}.png`,
    };
  });
};
