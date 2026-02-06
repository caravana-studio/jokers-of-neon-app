import { DAILY_MISSIONS } from "../../data/dailyMissions";
import i18n from "../../i18n";
import { decodeString } from "../utils/decodeString";

import {
  DailyMission,
  DailyMissionDifficulty,
} from "../../types/DailyMissions";

const FALLBACK_XP_BY_ORDER = [10, 20, 30];

const toNumber = (value: unknown) => {
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

export const getDailyMissions = async (
  client: any,
  userAddress: string
): Promise<DailyMission[]> => {
  try {
    let tx_result: any =
      await client.daily_missions_system.getDailyMissionTrackersForPlayer(
        userAddress
      );

    const xpByMissionId = new Map<string, number>();

    try {
      const xpForToday =
        await client.daily_missions_system.getDailyMissionsXpForToday();
      const xpEntries = Array.isArray(xpForToday)
        ? xpForToday
        : Object.values(xpForToday ?? {});

      xpEntries.forEach((mission: any) => {
        const missionIdRaw = mission?.[0] ?? mission?.mission_id;
        const xpRaw = mission?.[1] ?? mission?.xp;
        if (missionIdRaw === undefined) {
          return;
        }
        if (xpRaw === undefined || xpRaw === null) {
          return;
        }
        const id = decodeString(missionIdRaw);
        const xpValue = toNumber(xpRaw);
        if (xpValue === undefined) {
          return;
        }
        xpByMissionId.set(id, xpValue);
      });
    } catch (xpError) {
      console.log("getDailyMissionsXpForToday error", xpError);
    }

    return tx_result.map((mission: any, index: number) => {
      const id = decodeString(mission.mission_id);
      const difficulty = DAILY_MISSIONS[id] ?? DailyMissionDifficulty.EASY;
      const fallbackXp =
        FALLBACK_XP_BY_ORDER[index] ??
        FALLBACK_XP_BY_ORDER[FALLBACK_XP_BY_ORDER.length - 1];
      return {
        id,
        difficulty,
        xp: xpByMissionId.get(id) ?? fallbackXp,
        description: i18n.t(`data.${id}`, { ns: "achievements" }),
        completed: mission.completed,
      };
    });
  } catch (e) {
    console.log(e);
    return [];
  }
};
