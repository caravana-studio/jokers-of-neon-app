import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { SpecialNeonCardEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const SPECIAL_NEON_CARD_EVENT_KEY = getEventKey(DojoEvents.SPECIAL_NEON_CARD);

export const getSpecialNeonCardEvents = (
  events: DojoEvent[]
): SpecialNeonCardEvent[] => {
  const specialNeonEvents = events.filter(
    (event) => event.keys[1] === SPECIAL_NEON_CARD_EVENT_KEY
  );

  return specialNeonEvents.map((event) => {
    const idx = getNumberValueFromEvent(event, 5) ?? 0;
    const special_idx = getNumberValueFromEvent(event, 4) ?? 0;

    return {
      idx,
      special_idx,
    };
  });
};
