import { NEON_PLAY_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { NeonPlayEvent } from "../../types/ScoreData";
import { getArrayValueFromEvent } from "../getArrayValueFromEvent";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getNeonPlayEvent = (
  events: DojoEvent[]
): NeonPlayEvent | undefined => {

  const neonPlayEvent = events.find(
    (event) => event.keys[0] === NEON_PLAY_EVENT
  );
  
  return neonPlayEvent && {
    neon_cards_idx: getArrayValueFromEvent(neonPlayEvent, 1) ?? [],
    points: getNumberValueFromEvent(neonPlayEvent, 2) ?? 0,
    multi: getNumberValueFromEvent(neonPlayEvent, 3) ?? 0,
  }
};
