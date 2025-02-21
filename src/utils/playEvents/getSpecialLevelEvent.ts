import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const SPECIAL_POKER_HAND_EVENT_KEY = getEventKey(DojoEvents.POKER_HAND);

export const getSpecialLevelEvent = (events: DojoEvent[]) => {
  const event = events.find(
    (event) => event.keys[1] === SPECIAL_POKER_HAND_EVENT_KEY
  );
  if (!event) return undefined;
  const special_idx = getNumberValueFromEvent(event, 4) ?? 0;
  const multi = getNumberValueFromEvent(event, 5) ?? 0;
  const points = getNumberValueFromEvent(event, 6) ?? 0;
  return {
    special_idx,
    multi,
    points,
  };
};
