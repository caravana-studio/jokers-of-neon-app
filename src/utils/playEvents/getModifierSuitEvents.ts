import { DojoEvents } from "../../enums/dojoEvents";
import { Suits } from "../../enums/suits";
import { DojoEvent } from "../../types/DojoEvent";
import { ModifierSuitEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const MODIFIER_CARD_SUIT_EVENT_KEY = getEventKey(DojoEvents.MODIFIER_CARD_SUIT);

export const getModifierSuitEvents = (
  events: DojoEvent[]
): ModifierSuitEvent[] => {
  const modifierSuitEvents = events.filter(
    (event) => event.keys[1] === MODIFIER_CARD_SUIT_EVENT_KEY
  );

  return modifierSuitEvents.map((event) => {
    const idx = getNumberValueFromEvent(event, 5) ?? 0;
    const suit = getNumberValueFromEvent(event, 6) as Suits;
    return {
      idx,
      suit,
    };
  });
};
