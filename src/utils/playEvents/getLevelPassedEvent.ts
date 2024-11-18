import {
    PLAY_WIN_GAME_EVENT
} from "../../constants/dojoEventKeys";
import { DojoEvent } from "../../types/DojoEvent";
import {
    LevelPassedEvent
} from "../../types/ScoreData";
import {
    getNumberValueFromEvent
} from "../getNumberValueFromEvent";

export const getLevelPassedEvent = (
  events: DojoEvent[]
): LevelPassedEvent | undefined => {
  const levelPassedEvent = events.find(
    (event) => event.keys[1] === PLAY_WIN_GAME_EVENT
  );
  if (!levelPassedEvent) return undefined;
  const level = getNumberValueFromEvent(levelPassedEvent, 4) ?? 0;
  const score = getNumberValueFromEvent(levelPassedEvent, 5) ?? 0;
  return { level, score };
};
