import { GAME_POWER_UP_EVENT } from "../constants/dojoEventKeys";
import { getPowerUp } from "../dojo/queries/useGamePowerUps";
import { DojoEvent } from "../types/DojoEvent";
import { PowerUp } from "../types/PowerUp";
import { getArrayValueFromEvent } from "./getArrayValueFromEvent";

export const getPowerUpsFromEvents = (events: DojoEvent[]): PowerUp[] => {
  const event = events.find((event) => event.keys[1] === GAME_POWER_UP_EVENT);

  if (!event) return [];

  const powerUpIds = getArrayValueFromEvent(event, 4);
  return powerUpIds.map((power_up_id, index) => {
    return getPowerUp(power_up_id, index);
  });
};
