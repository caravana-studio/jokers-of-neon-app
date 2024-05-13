import { getComponentValue } from "@dojoengine/recs";
import { Entity, OverridableComponent } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";

export const getGame = (
  gameId: number,
  account: string,
  Game: OverridableComponent
) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(account),
  ]) as Entity;
  return getComponentValue(Game, entityId);
};

export const gameExists = (
  Game: OverridableComponent,
  account: string,
  gameId: number
) => {
  const game = getGame(gameId, account, Game);
  return !!game;
};
