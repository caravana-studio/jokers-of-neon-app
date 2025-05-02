import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { CardActivateEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const CARD_ACTIVATE_EVENT_KEY = getEventKey(DojoEvents.CARD_ACTIVATE);

export const getCardActivateEvent = (
  events: DojoEvent[]
): CardActivateEvent | undefined => {
  const cardActivateEvent = events.find(
    (event) => event.keys[1] === CARD_ACTIVATE_EVENT_KEY
  );
  if (!cardActivateEvent) return undefined;
  const special_id = getNumberValueFromEvent(cardActivateEvent, 4) ?? 0;

  return { special_id };
};
