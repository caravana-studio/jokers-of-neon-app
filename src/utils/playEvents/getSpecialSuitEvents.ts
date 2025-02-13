import { DojoEvents } from "../../enums/dojoEvents";
import { Suits } from "../../enums/suits";
import { DojoEvent } from "../../types/DojoEvent";
import { SpecialSuitEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const SPECIAL_MODIFIER_SUIT_EVENT_KEY = getEventKey(
  DojoEvents.SPECIAL_MODIFIER_SUIT
);

export const getSpecialSuitEvents = (
  events: DojoEvent[]
): SpecialSuitEvent[] => {
  const grouped: { [key: number]: number[] } = {};
  const specialSuit: { [key: number]: Suits } = {};

  const specialSuitEvents = events.filter(
    (event) => event.keys[1] === SPECIAL_MODIFIER_SUIT_EVENT_KEY
  );
  specialSuitEvents.forEach((event) => {
    const special_idx = getNumberValueFromEvent(event, 4) ?? 0;
    const idx = getNumberValueFromEvent(event, 5) ?? 0;
    const suit = getNumberValueFromEvent(event, 6) as Suits;
    if (!grouped[special_idx]) {
      grouped[special_idx] = [];
    }
    if (!specialSuit[special_idx]) {
      specialSuit[special_idx] = suit;
    }
    grouped[special_idx].push(idx);
  });
  return Object.keys(grouped).map((special_idx) => ({
    special_idx: Number(special_idx),
    idx: grouped[Number(special_idx)],
    suit: specialSuit[Number(special_idx)],
  }));
};
