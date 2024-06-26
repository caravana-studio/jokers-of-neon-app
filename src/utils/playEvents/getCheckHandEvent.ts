import { CHECK_HAND_EVENT } from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import { PlayEvent } from "../../types/ScoreData";
import { getNumberValueFromEvents } from "../getNumberValueFromEvent";

export const getCheckHandEvent = (events: DojoEvent[]): PlayEvent => {
  const play = getNumberValueFromEvents(events, CHECK_HAND_EVENT, 0) ?? 0;
  const multi = getNumberValueFromEvents(events, CHECK_HAND_EVENT, 1);
  const points = getNumberValueFromEvents(events, CHECK_HAND_EVENT, 2);
  return {
    play,
    multi,
    points,
  };
};
