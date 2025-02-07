import { CARD_PLAY_EVENT } from "../../constants/dojoEventKeys";
import { EventTypeEnum } from "../../dojo/typescript/models.gen";
import { DojoEvent } from "../../types/DojoEvent";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getCardPlayEvents = (events: DojoEvent[]) => {
  return events
    .filter((event) => event.keys[1] === CARD_PLAY_EVENT)
    .map((event) => {
      const eventType = getNumberValueFromEvent(event, 5) ?? (0 as EventTypeEnum);
      const firstArrayLength = getNumberValueFromEvent(event, 6) ?? 0;

      return {
        specials: getArrayValueFromEvent(event, 6),
        hand: getArrayValueFromEvent(event, firstArrayLength * 2 + 7),
        eventType,
      };
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
