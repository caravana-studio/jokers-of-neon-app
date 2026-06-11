import { renderMissionDescription } from "../data/dailyMissions";
import { useMissionsStore } from "../state/useMissionsStore";
import type { DailyMission } from "../types/DailyMissions";
import type { DailyMissionCompleted } from "../types/ScoreData";

const matchesCompletedMission = (
  candidate: DailyMission,
  completedMission: DailyMissionCompleted
) => {
  if (
    completedMission.missionId &&
    candidate.missionId === completedMission.missionId
  ) {
    return true;
  }

  if (
    completedMission.dailyMissionId &&
    candidate.missionId === completedMission.dailyMissionId
  ) {
    return true;
  }

  if (
    completedMission.templateId &&
    candidate.templateId === completedMission.templateId
  ) {
    if (
      completedMission.target !== undefined &&
      candidate.target !== undefined &&
      candidate.target !== completedMission.target
    ) {
      return false;
    }

    return true;
  }

  return false;
};

export const getCompletedMissionDescription = (
  mission: DailyMissionCompleted
): string => {
  const { dailyMissions, weeklyMissions } = useMissionsStore.getState();
  const activeMissions =
    mission.periodType === "weekly" ? weeklyMissions : dailyMissions;
  const matchedMission = activeMissions.find((candidate) =>
    matchesCompletedMission(candidate, mission)
  );

  if (matchedMission?.description) {
    return matchedMission.description;
  }

  return renderMissionDescription({
    templateId: mission.templateId || mission.dailyMissionId,
    target: mission.target,
    param1: mission.param1,
    param2: mission.param2,
  });
};
