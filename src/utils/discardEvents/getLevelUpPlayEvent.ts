import { LEVEL_UP_HAND_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { CashEvent } from "../../types/ScoreData";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export interface LevelUpPlayEvent {
  hand: number;
  level: number;
  points: number;
  multi: number;
}

export const getLevelUpPlayEvent = (events: DojoEvent[]) => {
  const levelUpEvent = events.find(
    (event) => event.keys[1] === LEVEL_UP_HAND_EVENT
  );

  if (!levelUpEvent) return undefined;

  const hand = getNumberValueFromEvent(levelUpEvent, 3) ?? 0;
  const level = getNumberValueFromEvent(levelUpEvent, 4) ?? 0;
  const points = getNumberValueFromEvent(levelUpEvent, 5) ?? 0;
  const multi = getNumberValueFromEvent(levelUpEvent, 6) ?? 0;

  return {
    hand,
    level,
    points,
    multi,
  };
};
