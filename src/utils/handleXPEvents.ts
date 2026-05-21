import { DojoEvent } from "../types/DojoEvent";
import { getDailyMissionCompleteEvent } from "./playEvents/getDailyMissionCompleteEvent";
import { getLevelCompleteEvent } from "./playEvents/getLevelCompleteEvent";
import {
  showDailyMissionToast,
  showDailyStreakToast,
  showLevelCompleteToast,
} from "./transactionNotifications";
import { registerMilestone } from "./appsflyerReferral";
import { TESTERS } from "../constants/testers";
import { useProfileStore } from "../state/useProfileStore";

const isTestUser = (username?: string | null): boolean => {
  if (!username) {
    return false;
  }

  const normalizedUsername = username.trim().toLowerCase();
  return TESTERS.some((tester) => tester.toLowerCase() === normalizedUsername);
};

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

    const dailyEvents = dailyMissionEvent.filter(
      (event) => event.periodType !== "weekly"
    );

    if (dailyEvents.length > 0) {
      // Register daily mission milestone for referral tracking
      registerMilestone(address, "daily_mission_completed", undefined, accountType, username ?? undefined)
        .catch((e) => console.error("Error registering daily mission milestone", e));

      if (isTestUser(username)) {
        const latestPeriodId = dailyEvents.reduce(
          (latest, event) => Math.max(latest, event.periodId ?? 0),
          0
        );
        const profileStore = useProfileStore.getState();
        const streakUpdate =
          latestPeriodId > 0
            ? profileStore.applyOptimisticDailyStreak(latestPeriodId)
            : null;

        if (streakUpdate?.extended) {
          showDailyStreakToast({
            currentStreak: streakUpdate.currentStreak,
            stackIndex: dailyMissionEvent.length,
          });
        }

        const refreshStreakStatus = (refresh = false) =>
          useProfileStore
            .getState()
            .fetchStreakStatus(address, {
              expectedPeriodId: latestPeriodId || undefined,
              preserveOptimistic: latestPeriodId > 0,
              refresh,
            })
            .catch((e) => {
              console.error("Error refreshing streak status", e);
            });

        refreshStreakStatus();
        window.setTimeout(() => refreshStreakStatus(true), 5000);
        window.setTimeout(() => refreshStreakStatus(true), 15000);
        window.setTimeout(() => refreshStreakStatus(true), 30000);
      }
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
