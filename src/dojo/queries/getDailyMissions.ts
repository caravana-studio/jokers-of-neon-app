import {
  getMissionDifficulty,
  getMissionPeriodType,
  MISSION_PERIOD,
  renderMissionDescription,
} from "../../data/dailyMissions";
import { DailyMission, MissionPeriodType } from "../../types/DailyMissions";
import { decodeString } from "../utils/decodeString";

type MissionQueryOptions = {
  gameId?: number;
};

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

const getReturnValues = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return Object.values(value ?? {});
};

const chunkSerializedArray = (value: unknown, itemSize: number): unknown[] => {
  const values = getReturnValues(value);
  const count = toNumber(values[0]);

  if (
    count !== undefined &&
    values.length === 1 + count * itemSize &&
    values.slice(1).every((item) => typeof item !== "object")
  ) {
    return Array.from({ length: count }, (_, index) => {
      const start = 1 + index * itemSize;
      return values.slice(start, start + itemSize);
    });
  }

  if (
    values.length > 0 &&
    values.length % itemSize === 0 &&
    values.every((item) => typeof item !== "object")
  ) {
    return Array.from({ length: values.length / itemSize }, (_, index) => {
      const start = index * itemSize;
      return values.slice(start, start + itemSize);
    });
  }

  return values;
};

const decodeFeltString = (value: unknown): string => {
  if (value === undefined || value === null || value === 0 || value === "0") {
    return "";
  }

  try {
    return decodeString(value as never);
  } catch {
    return String(value);
  }
};

const normalizeMissionSlot = (slot: unknown) => {
  const periodTypeRaw = getField(slot as Record<string, unknown>, 0, "period_type");
  const periodType = getMissionPeriodType(toNumber(periodTypeRaw));
  const difficulty = getMissionDifficulty(
    toNumber(getField(slot as Record<string, unknown>, 2, "difficulty"))
  );
  const missionId = decodeFeltString(
    getField(slot as Record<string, unknown>, 3, "mission_id")
  );
  const templateId = decodeFeltString(
    getField(slot as Record<string, unknown>, 4, "template_id")
  );
  const target = toNumber(
    getField(slot as Record<string, unknown>, 5, "target")
  ) ?? 0;

  return {
    periodType,
    periodId: toNumber(getField(slot as Record<string, unknown>, 1, "period_id")) ?? 0,
    difficulty,
    missionId,
    templateId,
    target,
    param1: toNumber(getField(slot as Record<string, unknown>, 6, "param_1")) ?? 0,
    param2: toNumber(getField(slot as Record<string, unknown>, 7, "param_2")) ?? 0,
    xp: toNumber(getField(slot as Record<string, unknown>, 8, "xp")),
  };
};

const normalizeProgress = (progress: unknown) => {
  const missionId = decodeFeltString(
    getField(progress as Record<string, unknown>, 3, "mission_id")
  );

  return {
    missionId,
    progress: toNumber(getField(progress as Record<string, unknown>, 4, "progress")) ?? 0,
    completed: Boolean(getField(progress as Record<string, unknown>, 5, "completed")),
  };
};

const normalizeGameProgress = (progress: unknown) => {
  const missionId = decodeFeltString(
    getField(progress as Record<string, unknown>, 2, "mission_id")
  );

  return {
    missionId,
    progress: toNumber(getField(progress as Record<string, unknown>, 3, "progress")) ?? 0,
    completed: Boolean(getField(progress as Record<string, unknown>, 4, "completed")),
  };
};

const getMissionsForPeriod = async (
  client: any,
  userAddress: string,
  periodType: MissionPeriodType,
  options: MissionQueryOptions = {}
): Promise<DailyMission[]> => {
  const periodTypeId =
    periodType === "weekly" ? MISSION_PERIOD.WEEKLY : MISSION_PERIOD.DAILY;
  const slotsRaw =
    periodType === "weekly"
      ? await client.daily_missions_system.getThisWeekMissions()
      : await client.daily_missions_system.getTodayMissions();

  const slots = chunkSerializedArray(slotsRaw, 9)
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
    chunkSerializedArray(progressRaw, 6)
      .map(normalizeProgress)
      .filter((progress) => progress.missionId)
      .map((progress) => [progress.missionId, progress])
  );

  const gameProgressRaw =
    periodType === "daily" && options.gameId && options.gameId > 0
      ? await client.daily_missions_system.getGameDailyMissionProgress(
          options.gameId
        )
      : [];

  const gameProgressByMissionId = new Map(
    chunkSerializedArray(gameProgressRaw, 5)
      .map(normalizeGameProgress)
      .filter((progress) => progress.missionId)
      .map((progress) => [progress.missionId, progress])
  );

  return slots.map((slot) => {
    const playerProgress = progressByMissionId.get(slot.missionId);
    const gameProgress = gameProgressByMissionId.get(slot.missionId);
    const visibleProgress =
      periodType === "daily" ? gameProgress : playerProgress;

    return {
      id: slot.templateId,
      missionId: slot.missionId,
      templateId: slot.templateId,
      difficulty: slot.difficulty,
      periodType: slot.periodType,
      periodId: slot.periodId,
      target: slot.target,
      progress:
        periodType === "daily" && !options.gameId
          ? undefined
          : visibleProgress?.progress ?? 0,
      param1: slot.param1,
      param2: slot.param2,
      xp: slot.xp ?? 0,
      description: renderMissionDescription({
        templateId: slot.templateId,
        target: slot.target,
        param1: slot.param1,
        param2: slot.param2,
      }),
      completed: playerProgress?.completed || gameProgress?.completed || false,
    };
  });
};

export const getDailyMissions = async (
  client: any,
  userAddress: string,
  options: MissionQueryOptions = {}
): Promise<DailyMission[]> => {
  try {
    return await getMissionsForPeriod(client, userAddress, "daily", options);
  } catch (error) {
    console.log("getDailyMissions new API error", error);
    return [];
  }
};

export const getWeeklyMissions = async (
  client: any,
  userAddress: string
): Promise<DailyMission[]> => {
  try {
    return await getMissionsForPeriod(client, userAddress, "weekly");
  } catch (error) {
    console.log("getWeeklyMissions error", error);
    return [];
  }
};
