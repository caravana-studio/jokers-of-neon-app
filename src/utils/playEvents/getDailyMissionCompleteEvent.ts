import { decodeString } from "../../dojo/utils/decodeString";
import { MISSION_PERIOD } from "../../data/dailyMissions";
import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { DailyMissionCompleted } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const MISSION_COMPLETE_EVENT_KEY = getEventKey(DojoEvents.DAILY_MISSION_COMPLETE);
const LEGACY_DAILY_MISSION_XP_EVENT_KEY = getEventKey("DailyMissionXPEvent");

const hasEventKey = (event: DojoEvent, key: string) => event.keys.includes(key);

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
  const layouts = [
    {
      // Transaction receipts prepend two Dojo metadata felts before the event.
      player: 2,
      periodType: 3,
      periodId: 4,
      missionId: 5,
      templateId: 6,
      difficulty: 7,
      target: 8,
      progress: 9,
      xp: 10,
      gameId: 11,
    },
    {
      // Some callers provide the serialized event without the Dojo prefix.
      player: 0,
      periodType: 1,
      periodId: 2,
      missionId: 3,
      templateId: 4,
      difficulty: 5,
      target: 6,
      progress: 7,
      xp: 8,
      gameId: 9,
    },
  ] as const;

  const parsed = layouts
    .map((layout) => {
      const missionId = decodeFeltStringFromEvent(event, layout.missionId);
      const templateId = decodeFeltStringFromEvent(event, layout.templateId);
      const periodTypeNumber = getNumberValueFromEvent(
        event,
        layout.periodType
      );
      const periodId = getNumberValueFromEvent(event, layout.periodId) ?? 0;
      const target = getNumberValueFromEvent(event, layout.target) ?? 0;
      const progress = getNumberValueFromEvent(event, layout.progress) ?? target;
      const baseXp = getNumberValueFromEvent(event, layout.xp) ?? 0;

      const periodType =
        periodTypeNumber === MISSION_PERIOD.WEEKLY
          ? ("weekly" as const)
          : ("daily" as const);

      return {
        player: event.data.at(layout.player) ?? event.keys.at(2) ?? "",
        dailyMissionId: templateId || missionId,
        missionId,
        templateId,
        periodType,
        periodTypeNumber,
        periodId,
        difficulty: getNumberValueFromEvent(event, layout.difficulty) ?? 0,
        target,
        progress,
        base_xp: baseXp,
        gameId: getNumberValueFromEvent(event, layout.gameId) ?? 0,
      };
    })
    .find(
      (candidate) =>
        (candidate.periodTypeNumber === MISSION_PERIOD.DAILY ||
          candidate.periodTypeNumber === MISSION_PERIOD.WEEKLY) &&
        candidate.periodId > 0 &&
        candidate.base_xp > 0 &&
        candidate.dailyMissionId
    );

  if (parsed) {
    const { periodTypeNumber: _periodTypeNumber, ...mission } = parsed;
    return mission;
  }

  return {
    player: event.data.at(2) ?? event.keys.at(2) ?? "",
    dailyMissionId: "",
    missionId: "",
    templateId: "",
    periodType: "daily",
    periodId: 0,
    difficulty: 0,
    target: 0,
    progress: 0,
    base_xp: 0,
    gameId: 0,
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
        hasEventKey(event, MISSION_COMPLETE_EVENT_KEY) ||
        hasEventKey(event, LEGACY_DAILY_MISSION_XP_EVENT_KEY)
    )
    .map((event) =>
      hasEventKey(event, MISSION_COMPLETE_EVENT_KEY)
        ? parseMissionCompletedEvent(event)
        : parseLegacyDailyMissionXpEvent(event)
    )
    .filter((event) => event.base_xp > 0);
};
