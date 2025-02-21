import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvents } from "../getNumberValueFromEvent";

const POKER_HAND_EVENT_KEY = getEventKey(DojoEvents.POKER_HAND);

export const getHandEvent = (events: DojoEvent[]) => {
  const playMulti = getNumberValueFromEvents(events, POKER_HAND_EVENT_KEY, 1);
  const playPoints = getNumberValueFromEvents(events, POKER_HAND_EVENT_KEY, 2);

  return {
    multi: playMulti ?? 1,
    points: playPoints ?? 0,
  };
};
