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
    const achievementNames = achievementEvent.map((achievement) =>
      i18n.t(`data.${achievement.achievementId}`, { ns: "achievements" })
    );

    showAchievementToast(achievementNames);

    // ONLY FOR GG CAMPAIGN
    //await handleAchievementPush(achievementEvent, achievementSound);
  }
};
