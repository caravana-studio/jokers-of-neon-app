import { useEffect, useState } from "react";
import { CLASSIC_MOD_ID } from "../../constants/general";
import { useDojo } from "../useDojo";
import { decodeString } from "../utils/decodeString";

export interface IMod {
  name: string;
  id: string;
  image?: string;
  description?: string;
  url?: string;
}

const getMods = async (client: any) => {
  try {
    let tx_result = await client.game_system.getGameMods();

    const transformedMods: IMod[] = tx_result.map((mod: any) => ({
      name: decodeString(mod.id),
      id: decodeString(mod.id),
    }));

    return transformedMods;
  } catch (e) {
    console.log(e);
  }
  return;
};

export const useGameMods = (): IMod[] => {
  const [mods, setMods] = useState<IMod[]>([]);

  const {
    setup: { client },
  } = useDojo();

  useEffect(() => {
    getMods(client).then((transformedMods) => {
      setMods(
        transformedMods?.filter((mod) => mod.id !== CLASSIC_MOD_ID) ?? []
      );
    });
  }, []);

  return mods;
};
