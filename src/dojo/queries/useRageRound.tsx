import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";

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
  const rageRound = useComponentValue(RageRound, entityId);
  console.log("got rage round", rageRound);
  return rageRound;
};

export const useRageCards = () => {
  /*   const rageRound = useRageRound();
  if (!rageRound || !rageRound.is_active || !rageRound.active_rage_ids) {
    return [];
  }
  const dojoRageCards = rageRound.active_rage_ids.map((card_id, index) => {
    return {
      card_id,
      isSpecial: false,
      id: card_id?.toString(),
      idx: index ?? 0,
      img: `rage/${card_id}.png`,
    };
  });
  console.log("dojoRageCards", dojoRageCards); */

  return [
    {
      name: "Silent Hearts",
      card_id: 401,
      img: "rage/401.png",
      id: "401",
      idx: 0,
    },
    {
      name: "Silent Diamonds",
      card_id: 402,
      img: "rage/402.png",
      id: "402",
      idx: 1,
    },
  ];
};
