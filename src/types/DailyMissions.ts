export enum DailyMissionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface DailyMission {
  id: number;
  description: string;
  completed: boolean;
  difficulty: DailyMissionDifficulty;
  xp: number;
}