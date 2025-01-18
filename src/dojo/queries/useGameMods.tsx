import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { useDojo } from "../useDojo";
import { decodeString } from "../utils/decodeString";

export interface IMod {
  name: string;
  id: number;
  image: string;
  description?: string;
  url?: string;
}

export const useGameMods = (): IMod[] => {
  const [mods, setMods] = useState<IMod[]>([]);

  const {
    setup: {
      clientComponents: { GameMod },
    },
  } = useDojo();

  const gameKeys = useEntityQuery([Has(GameMod)]);
  console.log("gameKeys", gameKeys);

  useEffect(() => {
    const transformedMods: IMod[] = gameKeys
      .map((entity) => getComponentValue(GameMod, entity))
      .filter((mod) => mod !== undefined)
      .map((mod) => ({
        name: decodeString(mod.name.toString()),
        id: mod.id,
        image: "classic",
      }));

    setMods(transformedMods);
  }, [gameKeys, GameMod]);

  return mods;
};
