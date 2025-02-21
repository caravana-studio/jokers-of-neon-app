import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { LevelPassedEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const PLAY_WIN_GAME_EVENT_KEY = getEventKey(DojoEvents.PLAY_WIN_GAME);

export const getLevelPassedEvent = (
  events: DojoEvent[]
): LevelPassedEvent | undefined => {
  const levelPassedEvent = events.find(
    (event) => event.keys[1] === PLAY_WIN_GAME_EVENT_KEY
  );
  if (!levelPassedEvent) return undefined;
  const level = getNumberValueFromEvent(levelPassedEvent, 4) ?? 0;
  const score = getNumberValueFromEvent(levelPassedEvent, 5) ?? 0;
  return { level, score };
};
