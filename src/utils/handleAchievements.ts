import { DojoEvent } from "../types/DojoEvent";
import { getAchievementCompleteEvent } from "./playEvents/getAchievementCompleteEvent";
import { handleAchievementPush } from "./pushAchievements";
import i18n from "i18next";
import { showAchievementToast } from "./transactionNotifications";
import {
  AchievementType,
  DAILY_ACHIEVEMENTS,
} from "./achievements/achievements";

export const handleAchievements = async (
  events: DojoEvent[],
  achievementSound: () => void
) => {
  const achievementEvent = getAchievementCompleteEvent(events);

  if (achievementEvent && achievementEvent.length > 0) {
    achievementSound();
    const achievementNames = achievementEvent.map((achievement) =>
      i18n.t(`data.${achievement.achievementId}`, { ns: "achievements" })
    );

    showAchievementToast(achievementNames);

    await handleAchievementPush(achievementEvent, achievementSound);
  }
};

export const checkDailyAchievement = async (
  type: AchievementType,
  value: number,
  playerAddress: string,
  achievementSound: () => void,
  triggeredAchievementsRef: React.MutableRefObject<Set<string>>
): Promise<void> => {
  const achievements = DAILY_ACHIEVEMENTS[type];

  for (const { id, threshold } of achievements) {
    if (value >= threshold && !triggeredAchievementsRef.current.has(id)) {
      triggeredAchievementsRef.current.add(id);

      showAchievementToast([i18n.t(`data.${id}`, { ns: "achievements" })]);

      await handleAchievementPush(
        [{ player: playerAddress, achievementId: id }],
        achievementSound
      );

      break;
    }
  }
};
