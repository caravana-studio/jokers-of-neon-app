import { DAILY_MISSIONS, XP_PER_DIFFICULTY } from "../../data/dailyMissions";
import i18n from "../../i18n";
import { decodeString } from "../utils/decodeString";

import {
  DailyMission,
  DailyMissionDifficulty,
} from "../../types/DailyMissions";

export const getDailyMissions = async (
  client: any,
  userAddress: string
): Promise<DailyMission[]> => {
  try {
    let tx_result: any =
      await client.daily_missions_system.getDailyMissionTrackersForPlayer(
        userAddress
      );

    return tx_result.map((mission: any) => {
      const id = decodeString(mission.mission_id);
      const difficulty = DAILY_MISSIONS[id] ?? DailyMissionDifficulty.EASY;
      return {
        id,
        difficulty,
        xp: XP_PER_DIFFICULTY[difficulty],
        description: i18n.t(`data.${id}`, { ns: "achievements" }),
        completed: mission.completed,
      };
    });
  } catch (e) {
    console.log(e);
    return [];
  }
};
