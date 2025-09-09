import { decodeString } from "../../dojo/utils/decodeString";
import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { AchievementCompleted } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";

const ACHIEVEMENT_COMPLETE_EVENT_KEY = getEventKey(
  DojoEvents.DAILY_MISSION_COMPLETE
);

export const getAchievementCompleteEvent = (
  events: DojoEvent[]
): AchievementCompleted[] | undefined => {
  return events
    .filter((event) => event.keys[1] === ACHIEVEMENT_COMPLETE_EVENT_KEY)
    .map((event) => {
      const player = event.data.at(1) ?? "";

      const txValue = event.data.at(3);
      const achievementId = decodeString(txValue ?? "");

      return { player, achievementId };
    });
};
