import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { getBooleanValueFromEvent } from "../getBooleanValueFromEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const SPECIAL_MODIFIER_POINTS_EVENT_KEY = getEventKey(
  DojoEvents.SPECIAL_MODIFIER_POINTS
);
const SPECIAL_MODIFIER_MULTI_KEY = getEventKey(
  DojoEvents.SPECIAL_MODIFIER_MULTI
);

export const getMultiPointEvents = (events: DojoEvent[]) => {
  return events
    .filter(
      (event) =>
        event.keys[1] === SPECIAL_MODIFIER_POINTS_EVENT_KEY ||
        event.keys[1] === SPECIAL_MODIFIER_MULTI_KEY
    )
    .map((event) => {
      const special_idx = getNumberValueFromEvent(event, 4) ?? 0;
      const idx = getNumberValueFromEvent(event, 5) ?? 0;
      let points;
      let multi;
      let negative = false;
      if (event.keys[1] === SPECIAL_MODIFIER_POINTS_EVENT_KEY) {
        points = getNumberValueFromEvent(event, 6) ?? 0;
      }
      if (event.keys[1] === SPECIAL_MODIFIER_MULTI_KEY) {
        multi = getNumberValueFromEvent(event, 6) ?? 0;
        negative = getBooleanValueFromEvent(event, 7) ?? false;
      }
      return {
        special_idx,
        idx,
        points,
        multi,
        negative,
      };
    })
    .filter(
      (event) =>
        (event.multi !== 0 && event.multi !== undefined) ||
        (event.points !== 0 && event.points !== undefined)
    );
};
