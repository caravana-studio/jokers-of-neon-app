import i18n from "i18next";
import { DojoEvent } from "../types/DojoEvent";
import { getAchievementCompleteEvent } from "./playEvents/getAchievementCompleteEvent";
import { showAchievementToast } from "./transactionNotifications";

export const handleAchievements = async (
  events: DojoEvent[],
  achievementSound: () => void
) => {
  const achievementEvent = getAchievementCompleteEvent(events);

  if (achievementEvent && achievementEvent.length > 0) {
    achievementSound();
    const achievementIds = achievementEvent.map((achievement) =>
      achievement.achievementId
    );

    showAchievementToast(achievementIds);

    // ONLY FOR GG CAMPAIGN
    //await handleAchievementPush(achievementEvent, achievementSound);
  }
};
