import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const CARD_SCORE_EVENT_KEY = getEventKey(DojoEvents.CARD_SCORE);

export const getTraditionalCardsEvents = (events: DojoEvent[]) => {
  return events
    .filter((event) => event.keys[1] === CARD_SCORE_EVENT_KEY)
    .map((event) => {
      const idx = getNumberValueFromEvent(event, 3) ?? 0;
      const multi = getNumberValueFromEvent(event, 4) ?? 0;
      const points = getNumberValueFromEvent(event, 5) ?? 0;
      return {
        idx,
        multi,
        points,
      };
    });
};
