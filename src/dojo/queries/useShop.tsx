import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";

export const useShop = () => {
  const {
    setup: {
      clientComponents: { Shop },
    },
  } = useDojo();
  const gameId = useGame().id;
  const entityId = getEntityIdFromKeys([BigInt(gameId)]) as Entity;
  return useComponentValue(Shop, entityId);
};
