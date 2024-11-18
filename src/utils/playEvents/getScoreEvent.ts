import { ROUND_SCORE_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

export const getScoreEvent = (events: DojoEvent[]): number => {
  const scoreEvent = events.find((event) => event.keys[1] === ROUND_SCORE_EVENT);
  if (!scoreEvent) return 0;
  const score = getNumberValueFromEvent(scoreEvent, 4) ?? 0;
  return score;
};
