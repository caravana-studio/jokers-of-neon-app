import { getComponentValue, Has } from "@dojoengine/recs";
import { GameMod } from "../typescript/models.gen";
import { useEffect, useState } from "react";
import { useDojo } from "../useDojo";
import { useEntityQuery } from "@dojoengine/react";

export const useGameMods = (): { mods: GameMod[] } => {
  const [plays, setPlays] = useState<any>({});

  const {
    setup: {
      clientComponents: { GameMod },
    },
  } = useDojo();

  const gameKeys = useEntityQuery([Has(GameMod)]);

  useEffect(() => {
    const components = gameKeys.map((entity) => {
      const component = getComponentValue(GameMod, entity);

      if (!component) {
        return undefined;
      }
      return component;
    });

    setPlays(components);
  }, [gameKeys]);

  return { mods: Object.values(plays) };
};
