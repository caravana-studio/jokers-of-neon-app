import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { ModifierNeonEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const MODIFIER_CARD_NEON_EVENT_KEY = getEventKey(DojoEvents.MODIFIER_CARD_NEON);

export const getModifierNeonEvents = (
  events: DojoEvent[]
): ModifierNeonEvent[] => {
  const modifierNeonEvents = events.filter(
    (event) => event.keys[1] === MODIFIER_CARD_NEON_EVENT_KEY
  );

  return modifierNeonEvents.map((event) => {
    const idx = getNumberValueFromEvent(event, 5) ?? 0;
    return {
      idx,
    };
  });
};
