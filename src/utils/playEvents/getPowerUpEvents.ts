import { POWER_UP_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getPowerUpEvents = (events: DojoEvent[]) => {
  return events
    .filter((event) => event.keys[1] === POWER_UP_EVENT)
    .map((event) => {
      const idx = getNumberValueFromEvent(event, 3) ?? 0;
      const multi = getNumberValueFromEvent(event, 4) ?? 0;

      const points = getNumberValueFromEvent(event, 5) ?? 0;

      return {
        idx,
        points,
        multi,
      };
    });
};
