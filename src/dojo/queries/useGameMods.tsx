import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { useDojo } from "../useDojo";
import { decodeString } from "../utils/decodeString";

export interface IMod {
  name: string;
  id: string;
  image: string;
  description?: string;
  url?: string;
}

const getMods = async (client: any) => {
  try {
    let tx_result = await client.game_system.getGameMods();
    console.log("tx_result", tx_result);
    console.log(decodeString(tx_result.id));
    /*return {
      maxPowerUpSlots: parseInt(tx_result.max_power_up_slots),
      maxSpecialCards: parseInt(tx_result.max_special_slots),
    }; */
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
    const transformedMods /* : IMod[] */ = getMods(client); /* .map((mod) => ({
        name: decodeString(mod.name.toString()),
        id: mod.id,
        image: "classic",
      })); */

    setMods([{ name: "nicon", id: "jokers_of_neon_nicon", image: "classic" }]);
  }, []);

  return mods;
};
