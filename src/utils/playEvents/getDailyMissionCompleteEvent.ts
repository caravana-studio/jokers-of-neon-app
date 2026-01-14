import { decodeString } from "../../dojo/utils/decodeString";
import { DojoEvents } from "../../enums/dojoEvents";
import { DojoEvent } from "../../types/DojoEvent";
import { DailyMissionCompleted } from "../../types/ScoreData";
import { getEventKey } from "../getEventKey";

const DAILY_MISSION_COMPLETE_EVENT_KEY = getEventKey(
  DojoEvents.DAILY_MISSION_COMPLETE
);

export const getDailyMissionCompleteEvent = (
  events: DojoEvent[]
): DailyMissionCompleted[] | undefined => {
  return events
    .filter((event) => event.keys[1] === DAILY_MISSION_COMPLETE_EVENT_KEY)
    .map((event) => {
      const player = event.data.at(1) ?? "";

      const txValue = event.data.at(2);
      const dailyMissionId = decodeString(txValue ?? "");

      return { player, dailyMissionId };
    });
};
