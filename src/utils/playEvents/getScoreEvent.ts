import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const ROUND_SCORE_EVENT_KEY = getEventKey(DojoEvents.ROUND_SCORE);

export const getScoreEvent = (events: DojoEvent[]): number => {
  const scoreEvent = events.find(
    (event) => event.keys[1] === ROUND_SCORE_EVENT_KEY
  );
  if (!scoreEvent) return 0;
  const score = getNumberValueFromEvent(scoreEvent, 4) ?? 0;
  return score;
};
