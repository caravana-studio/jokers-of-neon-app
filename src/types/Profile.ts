interface ProfileData {
  currentBadges: number;
  totalBadges: number;
  profile: Profile;
  playerStats: PlayerStats;
  xpLine: XpLine;
  streakStatus?: StreakStatus | null;
  streakSync?: StreakSyncState | null;
}

interface XpLine {
  prevLevelXp: number;
  nextLevelXp: number;
}

interface Profile {
  username: string,
  currentXp: number;
  totalXp: number;
  level: number;
  streak: number;
  avatarId: number;
}

interface StreakStatus {
  player: string;
  currentStreak: number;
  effectiveStreak: number;
  longestStreak: number;
  lastCompletedDay: number;
  protectorsAvailable: number;
  protectorsNeeded: number;
  daysMissed: number;
  isProtected: boolean;
  isBroken: boolean;
  syncStatus: "confirmed" | "pending" | "failed";
  pendingPeriodId: number | null;
  source: "cache" | "chain";
  updatedAt: string | null;
}

interface StreakSyncState {
  pending: boolean;
  optimistic: boolean;
  sourcePeriodId: number;
}

interface PlayerStats {
  games: number;
  victories: number;
}
