import { NEON_POKER_HAND_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { NeonPlayEvent } from "../../types/ScoreData";
import { getArrayValueFromEvent } from "../getArrayValueFromEvent";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getNeonPlayEvent = (
  events: DojoEvent[]
): NeonPlayEvent | undefined => {

  const neonPlayEvent = events.find(
    (event) => event.keys[1] === NEON_POKER_HAND_EVENT
  );

  const cardIndexes = getArrayValueFromEvent(neonPlayEvent, 4)
  const arrayLength = (neonPlayEvent ? getNumberValueFromEvent(neonPlayEvent, 4) : 0 ) ?? 0
  
  return neonPlayEvent && {
    neon_cards_idx: cardIndexes,
    points: getNumberValueFromEvent(neonPlayEvent, arrayLength + 6) ?? 0,
    multi: getNumberValueFromEvent(neonPlayEvent, arrayLength + 5) ?? 0,
  }
};
