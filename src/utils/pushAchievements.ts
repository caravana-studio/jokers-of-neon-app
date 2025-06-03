import { AchievementCompleted } from "../types/ScoreData";
import { addCachedPush } from "./achievementRetryCache";
import { PushActionsPayload, pushActions } from "./pushActions";

export const handleAchievementPush = async (
  achievementEvents: AchievementCompleted[]
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

      responses.forEach((response) => {
        if (response.status === 200) {
          console.log("action pushed", response.statusText);
        } else {
          console.error(
            "Failed to push actions, saving for retry, error: ",
            response.statusText
          );
          for (const achievement of achievementEvents) {
            addCachedPush({
              achievementId: achievement.achievementId,
              player: achievement.player,
            });
          }
        }
      });
    });
  } catch (error) {
    console.error("Failed to push actions", error);
  }
};
