import { pushActions } from "./pushActions";
import { getCachedPushes, removeCachedPush } from "./achievementRetryCache";

export const retryCachedAchievements = async () => {
  const cached = getCachedPushes();

  for (const { achievementId, player } of cached) {
    try {
      const payload = {
        actions: [achievementId],
        address: player,
      };
      const response = await pushActions(payload);

      if (response.status === 200) {
        console.log("Success ", response);
        removeCachedPush({ achievementId, player });
      } else {
        console.error(`Retry failed for ${achievementId} / ${player}`);
      }
    } catch (err) {
      console.error(`Retry failed for ${achievementId} / ${player}`, err);
    }
  }
};
