import { getComponentValue } from "@dojoengine/recs";
import { Entity, OverridableComponent } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";

export const getRound = (
  gameId: number,
  Round: OverridableComponent
) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
  ]) as Entity;
  return getComponentValue(Round, entityId);
};
