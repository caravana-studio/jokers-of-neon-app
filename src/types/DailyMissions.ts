export enum DailyMissionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export type MissionPeriodType = "daily" | "weekly";

export interface DailyMission {
  id: string;
  missionId: string;
  templateId: string;
  description: string;
  completed: boolean;
  difficulty: DailyMissionDifficulty;
  periodType: MissionPeriodType;
  periodId?: number;
  target?: number;
  progress?: number;
  param1?: number;
  param2?: number;
  xp: number;
}
