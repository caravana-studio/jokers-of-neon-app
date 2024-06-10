import {
  CARD_SCORE_EVENT,
  GAME_OVER_EVENT,
  LEVEL_PASSED_EVENT,
  PLAY_SCORE_EVENT,
  DETAIL_EARNED_EVENT
} from "../constants/dojoEventKeys"
import { DojoEvent } from "../types/DojoEvent";
import { DetailEarned, LevelPassedEvent, PlayEvents } from "../types/ScoreData"
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

const getDetailEarnedEvent = (events: DojoEvent[]): DetailEarned | undefined => {
  const detailEarnedEvent = events.find(
    (event) => event.keys[0] === DETAIL_EARNED_EVENT
  );
  if (!detailEarnedEvent) return undefined;
  const round_defeat = getNumberValueFromEvent(detailEarnedEvent, 1) ?? 0;
  const level_bonus = getNumberValueFromEvent(detailEarnedEvent, 2) ?? 0;
  const hands_left = getNumberValueFromEvent(detailEarnedEvent, 3) ?? 0;
  const hands_left_cash = getNumberValueFromEvent(detailEarnedEvent, 4) ?? 0;
  const discard_left = getNumberValueFromEvent(detailEarnedEvent, 5) ?? 0;
  const discard_left_cash = getNumberValueFromEvent(detailEarnedEvent, 6) ?? 0;
  const total = getNumberValueFromEvent(detailEarnedEvent, 7) ?? 0;

  return {
    round_defeat,
    level_bonus,
    hands_left,
    hands_left_cash,
    discard_left,
    discard_left_cash,
    total
  };
}

export const getPlayEvents = (events: DojoEvent[]): PlayEvents => {

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
    detailEarned: getDetailEarnedEvent(events),
  };

  return playEvents;
};
