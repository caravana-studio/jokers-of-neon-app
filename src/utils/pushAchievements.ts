import { AchievementCompleted } from "../types/ScoreData";
import { PushActionsPayload, pushActions } from "./pushActions";

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
