import {
  CARD_SCORE_EVENT,
  GAME_OVER_EVENT,
  LEVEL_PASSED_EVENT,
  PLAY_SCORE_EVENT,
} from "../constants/dojoEventKeys";
import { DojoEvent } from "../types/DojoEvent";
import { LevelPassedEvent, PlayEvents } from "../types/ScoreData";
import {
  getNumberValueFromEvent,
  getNumberValueFromEvents,
} from "./getNumberValueFromEvent";

const getLevelPassedEvent = (
  events: DojoEvent[]
): LevelPassedEvent | undefined => {
  const levelPassedEvent = events.find(
    (event) => event.keys[0] === LEVEL_PASSED_EVENT
  );
  if (!levelPassedEvent) return undefined;
  const level = getNumberValueFromEvent(levelPassedEvent, 1) ?? 0;
  const score = getNumberValueFromEvent(levelPassedEvent, 2) ?? 0;
  return { level, score };
};

export const getPlayEvents = (events: DojoEvent[]): PlayEvents => {
  console.log(
    "events pass level",
    events.filter((event) => event.data.length === 3)
  );
  // play score
  const playMulti = getNumberValueFromEvents(events, PLAY_SCORE_EVENT, 1);
  const playPoints = getNumberValueFromEvents(events, PLAY_SCORE_EVENT, 2);

  const playEvents = {
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
    gameOver: !!events.find((event) => event.keys[0] === GAME_OVER_EVENT),
    levelPassed: getLevelPassedEvent(events),
  };

  return playEvents;
};
