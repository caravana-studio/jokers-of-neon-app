import {
  getFallbackMissionXp,
  getMissionDifficulty,
  getMissionPeriodType,
  LEGACY_DAILY_MISSIONS,
  MISSION_PERIOD,
  renderMissionDescription,
} from "../../data/dailyMissions";
import { decodeString } from "../utils/decodeString";

import {
  DailyMission,
  DailyMissionDifficulty,
  MissionPeriodType,
} from "../../types/DailyMissions";

const LEGACY_FALLBACK_XP_BY_ORDER = [10, 20, 30];

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  if (value && typeof value === "object" && "toString" in value) {
    const parsed = Number((value as { toString: () => string }).toString());
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const getField = <T = unknown>(
  value: Record<string, unknown> | unknown[],
  index: number,
  key: string
): T | undefined => {
  if (Array.isArray(value)) {
    return value[index] as T;
  }
  return value?.[key as keyof typeof value] as T | undefined;
};

const decodeFeltString = (value: unknown): string => {
  if (value === undefined || value === null || value === 0 || value === "0") {
    return "";
  }
  try {
    return decodeString(value as any);
  } catch {
    return String(value);
  }
};

const normalizeMissionSlot = (slot: any) => {
  const periodTypeRaw = getField(slot, 0, "period_type");
  const periodType = getMissionPeriodType(toNumber(periodTypeRaw));
  const difficulty = getMissionDifficulty(toNumber(getField(slot, 2, "difficulty")));
  const missionId = decodeFeltString(getField(slot, 3, "mission_id"));
  const templateId = decodeFeltString(getField(slot, 4, "template_id"));
  const target = toNumber(getField(slot, 5, "target")) ?? 0;

  return {
    periodType,
    periodId: toNumber(getField(slot, 1, "period_id")) ?? 0,
    difficulty,
    missionId,
    templateId,
    target,
    param1: toNumber(getField(slot, 6, "param_1")) ?? 0,
    param2: toNumber(getField(slot, 7, "param_2")) ?? 0,
    xp: toNumber(getField(slot, 8, "xp")),
  };
};

const normalizeProgress = (progress: any) => {
  const missionId = decodeFeltString(getField(progress, 3, "mission_id"));
  return {
    missionId,
    progress: toNumber(getField(progress, 4, "progress")) ?? 0,
    completed: Boolean(getField(progress, 5, "completed")),
  };
};

const getMissionsForPeriod = async (
  client: any,
  userAddress: string,
  periodType: MissionPeriodType
): Promise<DailyMission[]> => {
  const periodTypeId =
    periodType === "weekly" ? MISSION_PERIOD.WEEKLY : MISSION_PERIOD.DAILY;
  const slotsRaw =
    periodType === "weekly"
      ? await client.daily_missions_system.getThisWeekMissions()
      : await client.daily_missions_system.getTodayMissions();

  const slots = (Array.isArray(slotsRaw) ? slotsRaw : Object.values(slotsRaw ?? {}))
    .map(normalizeMissionSlot)
    .filter((slot) => slot.missionId && slot.templateId && slot.target > 0);

  const currentPeriodId = slots[0]?.periodId ?? 0;
  const progressRaw =
    currentPeriodId > 0
      ? await client.daily_missions_system.getPlayerMissionProgress(
          userAddress,
          periodTypeId,
          currentPeriodId
        )
      : [];

  const progressByMissionId = new Map(
    (Array.isArray(progressRaw) ? progressRaw : Object.values(progressRaw ?? {}))
      .map(normalizeProgress)
      .filter((progress) => progress.missionId)
      .map((progress) => [progress.missionId, progress])
  );

  return slots.map((slot) => {
    const progress = progressByMissionId.get(slot.missionId);
    const xp = slot.xp ?? getFallbackMissionXp(slot.periodType, slot.difficulty);
    return {
      id: slot.templateId,
      missionId: slot.missionId,
      templateId: slot.templateId,
      difficulty: slot.difficulty,
      periodType: slot.periodType,
      periodId: slot.periodId,
      target: slot.target,
      progress: progress?.progress ?? 0,
      param1: slot.param1,
      param2: slot.param2,
      xp,
      description: renderMissionDescription({
        templateId: slot.templateId,
        target: slot.target,
        param1: slot.param1,
        param2: slot.param2,
      }),
      completed: progress?.completed ?? false,
    };
  });
};

const getLegacyDailyMissions = async (
  client: any,
  userAddress: string
): Promise<DailyMission[]> => {
  const txResult: any =
    await client.daily_missions_system.getDailyMissionTrackersForPlayer(
      userAddress
    );

  return txResult.map((mission: any, index: number) => {
    const id = decodeFeltString(mission.mission_id);
    const difficulty = LEGACY_DAILY_MISSIONS[id] ?? DailyMissionDifficulty.EASY;
    const fallbackXp =
      LEGACY_FALLBACK_XP_BY_ORDER[index] ??
      LEGACY_FALLBACK_XP_BY_ORDER[LEGACY_FALLBACK_XP_BY_ORDER.length - 1];
    return {
      id,
      missionId: id,
      templateId: id,
      difficulty,
      periodType: "daily" as const,
      xp: fallbackXp,
      description: renderMissionDescription({ templateId: id }),
      completed: mission.completed,
    };
  });
};

export const getDailyMissions = async (
  client: any,
  userAddress: string
): Promise<DailyMission[]> => {
  try {
    return await getMissionsForPeriod(client, userAddress, "daily");
  } catch (e) {
    console.log("getDailyMissions new API error", e);
    try {
      return await getLegacyDailyMissions(client, userAddress);
    } catch (legacyError) {
      console.log("getDailyMissions legacy error", legacyError);
      return [];
    }
  }
};

export const getWeeklyMissions = async (
  client: any,
  userAddress: string
): Promise<DailyMission[]> => {
  try {
    return await getMissionsForPeriod(client, userAddress, "weekly");
  } catch (e) {
    console.log("getWeeklyMissions error", e);
    return [];
  }
};
