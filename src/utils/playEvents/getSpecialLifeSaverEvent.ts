import { SPECIAL_LIFE_SAVER_EVENT} from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export interface LifeSaverSpecialCardEvent {
  special_idx?: number;
  old_level_score?: number;
  new_level_score?: number;
}

export const getSpecialLifeSaverEvent = (
  events: DojoEvent[]
) => {

  const event = events.find(
    (event) => event.keys[1] === SPECIAL_LIFE_SAVER_EVENT
  );

  if (!event) return undefined;

    const special_idx = getNumberValueFromEvent(event, 4) ?? 0;
    const old_level_score = getNumberValueFromEvent(event, 5) ?? 0;
    const new_level_score = getNumberValueFromEvent(event, 6) ?? 0;
    
    return {
      special_idx,
      old_level_score,
      new_level_score,
    }
};

