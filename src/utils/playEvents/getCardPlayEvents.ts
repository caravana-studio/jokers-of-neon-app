import { EventTypeEnum } from "../../dojo/typescript/custom";
import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const CARD_PLAY_EVENT_KEY = getEventKey(DojoEvents.CARD_PLAY);

export const getCardPlayEvents = (events: DojoEvent[]) => {
  return events
    .filter((event) => event.keys[1] === CARD_PLAY_EVENT_KEY)
    .flatMap((event) => {
      const eventType =
        getNumberValueFromEvent(event, 5) ?? (0 as EventTypeEnum);
      const firstArrayLength = getNumberValueFromEvent(event, 6) ?? 0;
      const specials = getArrayValueFromEvent(event, 6);
      const handItems = getArrayValueFromEvent(event, firstArrayLength * 2 + 7);
      
      // Create separate events for each hand item
      return handItems.map(handItem => ({
        specials,
        hand: [handItem],
        eventType,
      }));
    });
};

const getArrayValueFromEvent = (
  event: DojoEvent | undefined,
  indexToGet: number
): { idx: number; quantity: number }[] => {
  if (!event) {
    return [];
  }
  const array = [];
  const arrayLength = getNumberValueFromEvent(event, indexToGet) ?? 0;
  for (let i = indexToGet + 1; i <= indexToGet + arrayLength * 2; i = i + 2) {
    const idx = getNumberValueFromEvent(event, i) ?? 0;
    const quantity = getNumberValueFromEvent(event, i + 1) ?? 0;
    array.push({ idx, quantity });
  }
  return array;
};
