import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const POWER_UP_EVENT_KEY = getEventKey(DojoEvents.POWER_UP);

export const getPowerUpEvents = (events: DojoEvent[]) => {
  return events
    .filter((event) => event.keys[1] === POWER_UP_EVENT_KEY)
    .map((event) => {
      const idx = getNumberValueFromEvent(event, 3) ?? 0;
      const multi = getNumberValueFromEvent(event, 4) ?? 0;
      const points = getNumberValueFromEvent(event, 5) ?? 0;
      const special_idx = getNumberValueFromEvent(event, 6) ?? 0;

      return {
        idx,
        points,
        multi,
        special_idx,
      };
    })
    .sort((a, b) => a.idx - b.idx);
};
