import { Entity, Has, getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useEffect, useMemo, useState } from "react";
import { useDojo } from "../useDojo";
import { getLSGameId } from "../utils/getLSGameId";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { Game } from "../typescript/models.gen";

export const useGame = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();
  
  const gameId = getLSGameId();
  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(gameId)]) as Entity,
    [gameId],
  );
  const component = useComponentValue(Game, entityId);
  
  return component;
};


export const useGamev2 = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const [game, setGame] = useState<any>();
  const gameId = getLSGameId();

  const gameKeys = useEntityQuery([Has(Game)]);

  useEffect(() => {
    const foundGame = gameKeys
      .map((entity) => getComponentValue(Game, entity))
      .find((component) => component?.id === gameId);

    if (foundGame) {
      setGame(foundGame);
    }
  }, [gameKeys, gameId, Game]);

  return game;
};