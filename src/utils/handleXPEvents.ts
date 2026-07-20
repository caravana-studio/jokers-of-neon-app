import { DojoEvent } from "../types/DojoEvent";
import { getDailyMissionCompleteEvent } from "./playEvents/getDailyMissionCompleteEvent";
import { getLevelCompleteEvent } from "./playEvents/getLevelCompleteEvent";
import {
  showDailyMissionToast,
  showLevelCompleteToast,
} from "./transactionNotifications";
import { registerMilestone } from "./appsflyerReferral";
import { useStreakPresentationStore } from "../state/useStreakPresentationStore";

export const handleXPEvents = async (
  events: DojoEvent[],
  achievementSound: () => void,
  address: string,
  accountType?: "burner" | "controller" | "cavos" | null,
  username?: string | null,
  showToasts = true
) => {
  const dailyMissionEvent = getDailyMissionCompleteEvent(events);
  const levelCompleteEvents = getLevelCompleteEvent(events);

  if (dailyMissionEvent && dailyMissionEvent.length > 0) {
    const completedDailyMissions = dailyMissionEvent.filter(
      (mission) => mission.periodType === "daily"
    );
    const completedDailyPeriodId = completedDailyMissions
      .reduce(
        (latest, mission) => Math.max(latest, mission.periodId ?? 0),
        0
      );

    if (completedDailyMissions.length > 0) {
      useStreakPresentationStore
        .getState()
        .requestCheck(address, completedDailyPeriodId);
    }

    achievementSound();

    if (showToasts) {
      showDailyMissionToast(dailyMissionEvent);
    }

    // Register daily mission milestone for referral tracking
    registerMilestone(address, "daily_mission_completed", undefined, accountType, username ?? undefined)
      .catch((e) => console.error("Error registering daily mission milestone", e));

    // ONLY FOR GG CAMPAIGN
    //await handleAchievementPush(achievementEvent, achievementSound);
  }

  if (levelCompleteEvents && levelCompleteEvents.length > 0) {
    if (showToasts) {
      showLevelCompleteToast(levelCompleteEvents);
    }
  }
};
