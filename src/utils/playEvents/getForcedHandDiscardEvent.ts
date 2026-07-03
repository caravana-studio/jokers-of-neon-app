import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { ForcedHandDiscardEvent } from "../../types/ScoreData";
import { getArrayValueFromEvent } from "../getArrayValueFromEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const FORCED_HAND_DISCARD_EVENT_KEY = getEventKey(
  DojoEvents.FORCED_HAND_DISCARD
);

export const getForcedHandDiscardEvent = (
  events: DojoEvent[]
): ForcedHandDiscardEvent | undefined => {
  const forcedHandDiscardEvent = events.find(
    (event) => event.keys[1] === FORCED_HAND_DISCARD_EVENT_KEY
  );

  if (!forcedHandDiscardEvent) return undefined;

  return {
    game_id: getNumberValueFromEvent(forcedHandDiscardEvent, 2) ?? 0,
    discarded_hand_indexes: getArrayValueFromEvent(forcedHandDiscardEvent, 3),
  };
};
