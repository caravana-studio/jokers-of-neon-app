import { getComponentValue } from "@dojoengine/recs";
import { Entity, OverridableComponent } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";

export const getGame = (gameId: number, account: string, Game: OverridableComponent) => {
  console.log('Game', Game)
      const entityId = getEntityIdFromKeys([
        BigInt(1),
        BigInt(account),
      ]) as Entity; 
      return getComponentValue(Game, entityId);

  }

  //TODO: this should be replaced by getGame, it needs to check the game created is for the current account
  export const gameExists = (Game: OverridableComponent) => {
    return Game.values.id?.size > 0
  }