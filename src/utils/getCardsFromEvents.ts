import { DojoEvents } from "../enums/dojoEvents";
import { Card } from "../types/Card";
import { DojoEvent } from "../types/DojoEvent";
import { getArrayValueFromEvent } from "./getArrayValueFromEvent";
import { getEventKey } from "./getEventKey";

const CURRENT_HAND_EVENT_KEY = getEventKey(DojoEvents.CURRENT_HAND);

export const getCardsFromEvents = (events: DojoEvent[]): Card[] => {
  const event = events.find(
    (event) => event.keys[1] === CURRENT_HAND_EVENT_KEY
  );

  if (!event) return [];

  const cardIds = getArrayValueFromEvent(event, 3);

  return cardIds.map((card_id, index) => {
    return {
      card_id,
      img: `${card_id}.png`,
      isModifier: card_id >= 600 && card_id <= 700,
      isNeon: card_id >= 200 && card_id < 300,
      idx: index,
      id: index.toString(),
    };
  });
};
