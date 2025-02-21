import { getPowerUp } from "../dojo/queries/useGamePowerUps";
import { DojoEvents } from "../enums/dojoEvents";
import { DojoEvent } from "../types/DojoEvent";
import { PowerUp } from "../types/PowerUp";
import { getArrayValueFromEvent } from "./getArrayValueFromEvent";
import { getEventKey } from "./getEventKey";

const GAME_POWER_UP_EVENT_KEY = getEventKey(DojoEvents.GAME_POWER_UP);

export const getPowerUpsFromEvents = (events: DojoEvent[]): PowerUp[] => {
  const event = events.find(
    (event) => event.keys[1] === GAME_POWER_UP_EVENT_KEY
  );

  if (!event) return [];

  const powerUpIds = getArrayValueFromEvent(event, 4);
  return powerUpIds.map((power_up_id, index) => {
    return getPowerUp(power_up_id, index);
  });
};
