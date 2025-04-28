import { DojoEvent } from "../types/DojoEvent";
import { getAchievementCompleteEvent } from "./playEvents/getAchievementCompleteEvent";
import { handleAchievementPush } from "./pushAchievements";

export const handleAchievements = async (
  events: DojoEvent[],
  achievementSound: () => void
) => {
  console.log(events);
  const achievementEvent = getAchievementCompleteEvent(events);

  if (achievementEvent && achievementEvent.length > 0) {
    await handleAchievementPush(achievementEvent, achievementSound);
  }
};
