import { CARD_SCORE_EVENT, PLAY_SCORE_EVENT } from "../constants/dojoEventKeys";
import { DojoEvent } from "../types/DojoEvent";
import { ScoreData } from "../types/ScoreData";
import {
    getNumberValueFromEvent,
    getNumberValueFromEvents,
} from "./getNumberValueFromEvent";

export const getScoreData = (events: DojoEvent[]): ScoreData => {
  // play score
  const playMulti = getNumberValueFromEvents(events, PLAY_SCORE_EVENT, 0);
  const playPoints = getNumberValueFromEvents(events, PLAY_SCORE_EVENT, 1);
  const scoreData = {
    play: {
      multi: playMulti ?? 1,
      points: playPoints ?? 0,
    },
    cards: events
      .filter((event) => event.keys[0] === CARD_SCORE_EVENT)
      .map((event) => {
        const idx = getNumberValueFromEvent(event, 0) ?? 0;
        const multi = getNumberValueFromEvent(event, 1) ?? 0;
        const points = getNumberValueFromEvent(event, 2) ?? 0;
        return {
          idx,
          multi,
          points,
        };
      }),
  };

  return scoreData;
};
