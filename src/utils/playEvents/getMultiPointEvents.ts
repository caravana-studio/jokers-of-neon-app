import {
    SPECIAL_MODIFIER_MULTI_EVENT,
    SPECIAL_MODIFIER_POINTS_EVENT,
} from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";


export const getMultiPointEvents = (events: DojoEvent[]) => {
  return events
    .filter(
      (event) =>
        event.keys[1] === SPECIAL_MODIFIER_POINTS_EVENT ||
        event.keys[1] === SPECIAL_MODIFIER_MULTI_EVENT
    )
    .map((event) => {
      const special_idx = getNumberValueFromEvent(event, 4) ?? 0;
      const idx = getNumberValueFromEvent(event, 5) ?? 0;
      let points;
      let multi;
      if (event.keys[1] === SPECIAL_MODIFIER_POINTS_EVENT) {
        points = getNumberValueFromEvent(event, 6) ?? 0;
      }
      if (event.keys[1] === SPECIAL_MODIFIER_MULTI_EVENT) {
        multi = getNumberValueFromEvent(event, 6) ?? 0;
      }
      return {
        special_idx,
        idx,
        points,
        multi,
      };
    });
};
