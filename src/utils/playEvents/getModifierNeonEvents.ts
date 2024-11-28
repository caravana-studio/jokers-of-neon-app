import { MODIFIER_CARD_NEON_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { ModifierNeonEvent} from "../../types/ScoreData";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getModifierNeonEvents = (
  events: DojoEvent[]
): ModifierNeonEvent[] => {

  const modifierNeonEvents = events.filter(
    (event) => event.keys[1] === MODIFIER_CARD_NEON_EVENT
  );

  return modifierNeonEvents.map((event) => {
    const idx = getNumberValueFromEvent(event, 5) ?? 0;
    console.log(idx);
    return {
      idx,
    }
  })
  
};
