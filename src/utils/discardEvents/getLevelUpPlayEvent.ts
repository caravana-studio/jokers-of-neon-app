import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { LevelUpPlayEvent } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const POKER_HAND_LEVEL_UP_EVENT_KEY = getEventKey(
  DojoEvents.POKER_HAND_LEVEL_UP
);
const LEGACY_LEVEL_UP_HAND_EVENT_KEY = getEventKey(DojoEvents.LEVEL_UP_HAND);

export const getLevelUpPlayEvent = (
  events: DojoEvent[]
): LevelUpPlayEvent | undefined => {
  const levelUpEvent = events.find(
    (event) =>
      event.keys[1] === POKER_HAND_LEVEL_UP_EVENT_KEY ||
      event.keys[1] === LEGACY_LEVEL_UP_HAND_EVENT_KEY
  );

  if (!levelUpEvent) return undefined;
  const isLegacyLevelUpEvent =
    levelUpEvent.keys[1] === LEGACY_LEVEL_UP_HAND_EVENT_KEY;

  const hand = getNumberValueFromEvent(levelUpEvent, 3) ?? 0;
  const old_level = getNumberValueFromEvent(levelUpEvent, 4) ?? 0;

  const old_points =
    getNumberValueFromEvent(levelUpEvent, isLegacyLevelUpEvent ? 5 : 8) ?? 0;
  const old_multi = getNumberValueFromEvent(levelUpEvent, 6) ?? 0;
  const level =
    getNumberValueFromEvent(levelUpEvent, isLegacyLevelUpEvent ? 7 : 5) ?? 0;
  const points =
    getNumberValueFromEvent(levelUpEvent, isLegacyLevelUpEvent ? 8 : 9) ?? 0;
  const multi =
    getNumberValueFromEvent(levelUpEvent, isLegacyLevelUpEvent ? 9 : 7) ?? 0;

  return {
    hand,
    old_level,
    old_points,
    old_multi,
    level,
    points,
    multi,
  };
};
