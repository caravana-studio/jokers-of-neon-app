import { decodeString } from "../../dojo/utils/decodeString";
import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { AchievementCompleted } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";
import { getNumberValueFromEvent } from "../getNumberValueFromEvent";

const ACHIEVEMENT_COMPLETE_EVENT_KEY = getEventKey(
  DojoEvents.ACHIEVEMENT_COMPLETE
);

export const getAchievementCompleteEvent = (
  events: DojoEvent[]
): AchievementCompleted | undefined => {
  const achievementComplete = events.find(
    (event) => event.keys[1] === ACHIEVEMENT_COMPLETE_EVENT_KEY
  );
  if (!achievementComplete) return undefined;

  const player = achievementComplete.data.at(1) ?? "";

  const txValue = achievementComplete.data.at(3);
  const achievementId = decodeString(txValue ?? "");

  return { player, achievementId };
};
