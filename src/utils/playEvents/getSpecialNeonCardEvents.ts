import { SPECIAL_NEON_CARD_EVENT} from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { SpecialNeonCardEvent} from "../../types/ScoreData";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getSpecialNeonCardEvents = (
  events: DojoEvent[]
): SpecialNeonCardEvent[] => {

  const specialNeonEvents = events.filter(
    (event) => event.keys[1] === SPECIAL_NEON_CARD_EVENT
  );
  
  return specialNeonEvents.map((event) => {
    const idx = getNumberValueFromEvent(event, 5) ?? 0;
    const special_idx = getNumberValueFromEvent(event, 4) ?? 0;
    
    return {
      idx,
      special_idx
    }
  })
  
};
