import { AchievementCompleted } from "../types/ScoreData";
import { PushActionsPayload, pushActions } from "./pushActions";
import { showAchievementToast } from "./transactionNotifications";

export const handleAchievementPush = async (
  achievementEvent: AchievementCompleted
) => {
  const payloads: PushActionsPayload[] = [
    {
      actions: [achievementEvent.achievementId],
      address: achievementEvent.player,
    },
  ];

  showAchievementToast(achievementEvent.achievementId);

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
