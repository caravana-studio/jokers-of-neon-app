import { postDailyMissionXP } from "../api/postDailyMissionXP";
import { DAILY_MISSIONS } from "../data/dailyMissions";
import { DojoEvent } from "../types/DojoEvent";
import { getDailyMissionCompleteEvent } from "./playEvents/getDailyMissionCompleteEvent";
import { getLevelCompleteEvent } from "./playEvents/getLevelCompleteEvent";
import {
  showDailyMissionToast,
  showLevelCompleteToast,
} from "./transactionNotifications";
import { registerMilestone } from "./appsflyerReferral";

export const handleXPEvents = async (
  events: DojoEvent[],
  achievementSound: () => void,
  address: string,
  accountType?: "burner" | "controller" | null,
  username?: string | null
) => {
  const dailyMissionEvent = getDailyMissionCompleteEvent(events);
  const levelCompleteEvents = getLevelCompleteEvent(events);

  if (dailyMissionEvent && dailyMissionEvent.length > 0) {
    achievementSound();
    const dailyMissionIds = dailyMissionEvent.map(
      (mission) => mission.dailyMissionId
    );

    showDailyMissionToast(dailyMissionEvent);

    dailyMissionIds.forEach((id) => {
      const missionDifficulty = DAILY_MISSIONS[id];
      missionDifficulty &&
        postDailyMissionXP({
          address,
          missionDifficulty,
        }).catch((e) => console.error("Error posting daily mission XP", e));
    });

    // Register daily mission milestone for referral tracking
    registerMilestone(address, "daily_mission_completed", undefined, accountType, username ?? undefined)
      .catch((e) => console.error("Error registering daily mission milestone", e));

    // ONLY FOR GG CAMPAIGN
    //await handleAchievementPush(achievementEvent, achievementSound);
  }

  if (levelCompleteEvents && levelCompleteEvents.length > 0) {
    showLevelCompleteToast(levelCompleteEvents);
  }
};
