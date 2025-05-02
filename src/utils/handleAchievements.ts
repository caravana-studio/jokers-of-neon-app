import { DojoEvent } from "../types/DojoEvent";
import { getAchievementCompleteEvent } from "./playEvents/getAchievementCompleteEvent";
import { handleAchievementPush } from "./pushAchievements";
import i18n from "i18next";
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

    await handleAchievementPush(achievementEvent, achievementSound);
  }
};
