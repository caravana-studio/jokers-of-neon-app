import { decodeString } from "../../dojo/utils/decodeString";
import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { DailyMissionCompleted } from "../../types/ScoreData";
import { MISSION_PERIOD } from "../../data/dailyMissions";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const MISSION_COMPLETE_EVENT_KEY = getEventKey(DojoEvents.DAILY_MISSION_COMPLETE);
const LEGACY_DAILY_MISSION_XP_EVENT_KEY = getEventKey("DailyMissionXPEvent");

const decodeFeltStringFromEvent = (event: DojoEvent, index: number) => {
  const value = event.data.at(index);
  if (!value) {
    return "";
  }
  try {
    return decodeString(value);
  } catch {
    return value;
  }
};

const parseMissionCompletedEvent = (event: DojoEvent): DailyMissionCompleted => {
  const missionId = decodeFeltStringFromEvent(event, 5);
  const templateId = decodeFeltStringFromEvent(event, 6);
  const periodTypeNumber = getNumberValueFromEvent(event, 2) ?? MISSION_PERIOD.DAILY;
  const target = getNumberValueFromEvent(event, 8) ?? 0;
  const progress = getNumberValueFromEvent(event, 9) ?? target;
  const baseXp = getNumberValueFromEvent(event, 10) ?? 0;

  return {
    player: event.data.at(1) ?? "",
    dailyMissionId: templateId || missionId,
    missionId,
    templateId,
    periodType: periodTypeNumber === MISSION_PERIOD.WEEKLY ? "weekly" : "daily",
    periodId: getNumberValueFromEvent(event, 3) ?? 0,
    difficulty: getNumberValueFromEvent(event, 7) ?? 0,
    target,
    progress,
    base_xp: baseXp,
    gameId: getNumberValueFromEvent(event, 11) ?? 0,
  };
};

const parseLegacyDailyMissionXpEvent = (event: DojoEvent): DailyMissionCompleted => {
  const dailyMissionId = decodeFeltStringFromEvent(event, 3);
  return {
    player: event.data.at(1) ?? "",
    dailyMissionId,
    missionId: dailyMissionId,
    templateId: dailyMissionId,
    periodType: "daily",
    difficulty: getNumberValueFromEvent(event, 4) ?? 0,
    base_xp: getNumberValueFromEvent(event, 5) ?? 0,
  };
};

export const getDailyMissionCompleteEvent = (
  events: DojoEvent[]
): DailyMissionCompleted[] | undefined => {
  return events
    .filter(
      (event) =>
        event.keys[1] === MISSION_COMPLETE_EVENT_KEY ||
        event.keys[1] === LEGACY_DAILY_MISSION_XP_EVENT_KEY
    )
    .map((event) =>
      event.keys[1] === MISSION_COMPLETE_EVENT_KEY
        ? parseMissionCompletedEvent(event)
        : parseLegacyDailyMissionXpEvent(event)
    )
    .filter((event) => event.base_xp > 0);
};
