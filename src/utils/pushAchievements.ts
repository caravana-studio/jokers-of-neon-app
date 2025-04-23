import { AchievementCompleted } from "../types/ScoreData";
import { PushActionsPayload, pushActions } from "./pushActions";
import { showAchievementToast } from "./transactionNotifications";
import i18n from "i18next";

export const handleAchievementPush = async (
  achievementEvents: AchievementCompleted[],
  achievementSound: () => void
) => {
  const payloads: PushActionsPayload[] = [
    {
      actions: achievementEvents.map(
        (achievement) => achievement.achievementId
      ),
      address: achievementEvents[0].player,
    },
  ];

  achievementSound();
  achievementEvents.forEach((achievement) => {
    showAchievementToast(
      i18n.t(`data.${achievement.achievementId}`, { ns: "achievements" })
    );
  });

  try {
    const promises = payloads.map((payload) => pushActions(payload));
    console.log(payloads);
    await Promise.all(promises).then((responses) => {
      console.log(responses);
    });
  } catch (error) {
    console.error("Failed to push actions", error);
  }
};
