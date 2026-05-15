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
  accountType?: "burner" | "controller" | "cavos" | null,
  username?: string | null,
  showToasts = true
) => {
  const dailyMissionEvent = getDailyMissionCompleteEvent(events);
  const levelCompleteEvents = getLevelCompleteEvent(events);

  if (dailyMissionEvent && dailyMissionEvent.length > 0) {
    achievementSound();

    if (showToasts) {
      showDailyMissionToast(dailyMissionEvent);
    }

    if (dailyMissionEvent.some((event) => event.periodType !== "weekly")) {
      registerMilestone(
        address,
        "daily_mission_completed",
        undefined,
        accountType,
        username ?? undefined
      )
        .catch((e) => console.error("Error registering daily mission milestone", e));
    }

    // ONLY FOR GG CAMPAIGN
    //await handleAchievementPush(achievementEvent, achievementSound);
  }

  if (levelCompleteEvents && levelCompleteEvents.length > 0) {
    if (showToasts) {
      showLevelCompleteToast(levelCompleteEvents);
    }
  }
};
