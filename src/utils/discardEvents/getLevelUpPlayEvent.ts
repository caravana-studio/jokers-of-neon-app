import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export interface LevelUpPlayEvent {
  hand: number;
  old_level: number;
  old_points: number;
  old_multi: number;
  level: number;
  points: number;
  multi: number;
}

const LEVEL_UP_HAND_EVENT_KEY = getEventKey(DojoEvents.LEVEL_UP_HAND);

export const getLevelUpPlayEvent = (events: DojoEvent[]) => {
  const levelUpEvent = events.find(
    (event) => event.keys[1] === LEVEL_UP_HAND_EVENT_KEY
  );

  if (!levelUpEvent) return undefined;

  const hand = getNumberValueFromEvent(levelUpEvent, 3) ?? 0;
  const old_level = getNumberValueFromEvent(levelUpEvent, 4) ?? 0;
  const old_points = getNumberValueFromEvent(levelUpEvent, 5) ?? 0;
  const old_multi = getNumberValueFromEvent(levelUpEvent, 6) ?? 0;
  const level = getNumberValueFromEvent(levelUpEvent, 7) ?? 0;
  const points = getNumberValueFromEvent(levelUpEvent, 8) ?? 0;
  const multi = getNumberValueFromEvent(levelUpEvent, 9) ?? 0;

  return {
    hand,
    old_level,
    old_points,
    old_multi,
    level,
    points,
    multi,
  };
};
