import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { PowerUp } from "../../types/Powerup/PowerUp";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";
import { useGameContext } from "../../providers/GameProvider";
import { powerupStyles } from "../../constants/powerupStyles";
import { useGameStore } from "../../state/useGameStore";

export const getPowerUp = (
  power_up_id: number,
  idx: number,
  game_id: number = 0
) => {
  return {
    power_up_id,
    img: `/powerups/${power_up_id}.png`,
    idx,
    cost: 0,
    discount_cost: 0,
    purchased: false,
    fieldOrder: [],
    game_id,
    style: powerupStyles[power_up_id],
  };
};

export const useGamePowerUps = () => {
  const {
    setup: {
      clientComponents: { GamePowerUp },
    },
  } = useDojo();

  const { maxPowerUpSlots } = useGameContext();

  const { id} = useGameStore();

  const entityId = getEntityIdFromKeys([BigInt(id ?? 0)]) as Entity;
  const gamePowerUp = useComponentValue(GamePowerUp, entityId);

  const dojoPowerUps = gamePowerUp?.power_ups ?? [];

  const powerUps: (PowerUp | null)[] = dojoPowerUps
    .map((powerUp: any, index: number) => {
      const power_up_id = powerUp.value;
      return getPowerUp(power_up_id, index, id ?? 0);
    })
    .filter((powerUp: any) => powerUp.power_up_id !== 9999);

  // Fill the remaining slots with null placeholders up to powerUpSize
  while (powerUps.length < maxPowerUpSlots) {
    powerUps.push(null);
  }

  return powerUps;
};
