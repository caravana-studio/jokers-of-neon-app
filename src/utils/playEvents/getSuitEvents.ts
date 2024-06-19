import { SPECIAL_SUIT_EVENT } from "../../constants/dojoEventKeys";
import { Suits } from "../../enums/suits";
import { DojoEvent } from "../../types/DojoEvent";
import { SuitEvent } from "../../types/ScoreData";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getSuitEvents = (events: DojoEvent[]): SuitEvent[] => {
  const suitEvents: SuitEvent[] = [];
  events.forEach((event) => {
    if (event.keys[0] === SPECIAL_SUIT_EVENT) {
      const special_idx = getNumberValueFromEvent(event, 1) ?? 0;
      const idx = getNumberValueFromEvent(event, 2) ?? 0;
      const suit = getNumberValueFromEvent(event, 3) as Suits;
      suitEvents.push({ suit, idx, special_idx });
    }
  });
  return suitEvents;
};
