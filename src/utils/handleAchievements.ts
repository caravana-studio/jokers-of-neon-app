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

export const handeDailyGameAchievements = async (
  level: number,
  score: number,
  achievementSound: () => void,
  playerAddress: string
) => {
  let achievementId = "";
  if (level === 2) {
    achievementId = "level_daily_easy";
  } else if (level === 3) {
    achievementId = "level_daily_medium";
  } else if (level === 5) {
    achievementId = "level_daily_hard";
  }

  if (score >= 500000) {
    achievementId = "score_daily_hard";
  }

  if (achievementId !== "") {
    console.log("DAILY ACHIEVEMENT", achievementId);
    showAchievementToast([
      i18n.t(`data.${achievementId}`, { ns: "achievements" }),
    ]);

    await handleAchievementPush(
      [{ player: playerAddress, achievementId: achievementId }],
      achievementSound
    );
  }
};
