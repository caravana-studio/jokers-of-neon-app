export type AchievementType = "score" | "level" | "specials";

export interface DailyAchievement {
  id: string;
  threshold: number;
}

export const DAILY_ACHIEVEMENTS: Record<AchievementType, DailyAchievement[]> = {
  score: [{ id: "score_daily_hard", threshold: 500000 }],
  level: [
    { id: "level_daily_easy", threshold: 2 },
    { id: "level_daily_medium", threshold: 3 },
    { id: "level_daily_hard", threshold: 5 },
  ],
  specials: [{ id: "special_daily_medium", threshold: 405 }],
};
