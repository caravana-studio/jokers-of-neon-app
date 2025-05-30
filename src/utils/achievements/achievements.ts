export type AchievementType = "score" | "level" | "special";

export interface DailyAchievement {
  id: string;
  value: number;
}

export const DAILY_ACHIEVEMENTS: Record<AchievementType, DailyAchievement[]> = {
  score: [{ id: "score_daily_hard", value: 500000 }],
  level: [
    { id: "level_daily_easy", value: 2 },
    { id: "level_daily_medium", value: 3 },
    { id: "level_daily_hard", value: 5 },
  ],
  special: [{ id: "special_daily_medium", value: 323 }],
};
