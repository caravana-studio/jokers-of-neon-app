import { postDailyMissionXP } from "../api/postDailyMissionXP";
import { DAILY_MISSIONS } from "../data/dailyMissions";
import { DojoEvent } from "../types/DojoEvent";
import { getDailyMissionCompleteEvent } from "./playEvents/getDailyMissionCompleteEvent";
import { getLevelCompleteEvent } from "./playEvents/getLevelCompleteEvent";
import {
  showDailyMissionToast,
  showLevelCompleteToast,
} from "./transactionNotifications";

export const handleXPEvents = async (
  events: DojoEvent[],
  achievementSound: () => void,
  address: string
) => {
  const dailyMissionEvent = getDailyMissionCompleteEvent(events);
  const levelCompleteEvents = getLevelCompleteEvent(events);

  if (dailyMissionEvent && dailyMissionEvent.length > 0) {
    achievementSound();
    const dailyMissionIds = dailyMissionEvent.map(
      (mission) => mission.dailyMissionId
    );

    showDailyMissionToast(dailyMissionIds);

    dailyMissionIds.forEach((id) => {
      const missionDifficulty = DAILY_MISSIONS[id];
      missionDifficulty &&
        postDailyMissionXP({
          address,
          missionDifficulty,
        }).catch((e) => console.error("Error posting daily mission XP", e));
    });

    // ONLY FOR GG CAMPAIGN
    //await handleAchievementPush(achievementEvent, achievementSound);
  }

  if (levelCompleteEvents && levelCompleteEvents.length > 0) {
    showLevelCompleteToast(levelCompleteEvents);
  }
};
