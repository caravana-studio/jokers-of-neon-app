import { MODIFIER_CARD_SUIT_EVENT } from "../../constants/dojoEventKeys";
import { Suits } from "../../enums/suits";
import { DojoEvent } from "../../types/DojoEvent";
import { ModifierSuitEvent } from "../../types/ScoreData";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getModifierSuitEvents = (
  events: DojoEvent[]
): ModifierSuitEvent[] => {
  
  const modifierSuitEvents = events.filter(
    (event) => event.keys[1] === MODIFIER_CARD_SUIT_EVENT
  );

  return modifierSuitEvents.map((event) => {
    const idx = getNumberValueFromEvent(event, 5) ?? 0;
    const suit = getNumberValueFromEvent(event, 6) as Suits;
    return {
      idx,
      suit,
    }
  })
  
};
