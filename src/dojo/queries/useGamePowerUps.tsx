import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { PowerUp } from "../../types/PowerUp";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";

export const useGamePowerUps = () => {
  const {
    setup: {
      clientComponents: { GamePowerUp },
    },
  } = useDojo();

  const game = useGame();

  const powerUpSize = game?.len_max_current_power_ups ?? 4;
  const entityId = getEntityIdFromKeys([BigInt(game?.id ?? 0)]) as Entity;
  const gamePowerUp = useComponentValue(GamePowerUp, entityId);
  if (!game) return [];

  const dojoPowerUps = gamePowerUp?.power_ups ?? [];

  const powerUps: (PowerUp | null)[] = dojoPowerUps
    .map((powerUp: any, index: number) => {
      const power_up_id = powerUp.value;
      return {
        power_up_id,
        img: `/powerups/${power_up_id}.png`,
        img_big: `/powerups/big/${power_up_id}.png`,
        idx: index,
        cost: 0,
        purchased: false,
        fieldOrder: [],
        game_id: game.id,
      };
    })
    .filter((powerUp: any) => powerUp.power_up_id !== 9999);

  // Fill the remaining slots with null placeholders up to powerUpSize
  while (powerUps.length < powerUpSize) {
    powerUps.push(null);
  }

  return powerUps;
};
