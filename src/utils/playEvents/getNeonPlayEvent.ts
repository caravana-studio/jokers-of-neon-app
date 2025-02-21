import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { NeonPlayEvent } from "../../types/ScoreData";
import { getArrayValueFromEvent } from "../getArrayValueFromEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const NEON_POKER_HAND_EVENT_KEY = getEventKey(DojoEvents.NEON_POKER_HAND)

export const getNeonPlayEvent = (
  events: DojoEvent[]
): NeonPlayEvent | undefined => {

  const neonPlayEvent = events.find(
    (event) => event.keys[1] === NEON_POKER_HAND_EVENT_KEY
  );

  const cardIndexes = getArrayValueFromEvent(neonPlayEvent, 4)
  const arrayLength = (neonPlayEvent ? getNumberValueFromEvent(neonPlayEvent, 4) : 0 ) ?? 0
  
  return neonPlayEvent && {
    neon_cards_idx: cardIndexes,
    points: getNumberValueFromEvent(neonPlayEvent, arrayLength + 6) ?? 0,
    multi: getNumberValueFromEvent(neonPlayEvent, arrayLength + 5) ?? 0,
  }
};
