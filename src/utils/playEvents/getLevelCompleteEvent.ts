import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { LevelCompleteEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const LEVEL_COMPLETE_EVENT_KEY = getEventKey(DojoEvents.LEVEL_COMPLETE);

export const getLevelCompleteEvent = (
  events: DojoEvent[]
): LevelCompleteEvent[] | undefined => {
  return events
    .filter((event) => event.keys[1] === LEVEL_COMPLETE_EVENT_KEY)
    .map((event) => {
      const level = getNumberValueFromEvent(event, 4) ?? 0;
      const completion_count = getNumberValueFromEvent(event, 5) ?? 0;
      const base_xp = getNumberValueFromEvent(event, 6) ?? 0;

      return {
        level,
        completion_count,
        base_xp,
      };
    });
};
