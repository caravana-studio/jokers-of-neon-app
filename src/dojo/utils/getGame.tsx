import { Component, Entity, getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { decodeString } from "./decodeString";

export const getGame = (gameId: number, Game: Component) => {
  const entityId = getEntityIdFromKeys([BigInt(gameId)]) as Entity;
  return getComponentValue(Game, entityId);
};

export const gameExists = (Game: Component, gameId: number, modId?: string) => {
  const game = getGame(gameId, Game);
  const gameBelongsToCurrentMod =
    modId && modId === decodeString(game?.mod_id ?? "");
  return !!game && gameBelongsToCurrentMod;
};
