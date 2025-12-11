interface ProfileData {
  currentBadges: number;
  totalBadges: number;
  profile: Profile;
  playerStats: PlayerStats;
  xpLine: XpLine;
}

interface XpLine {
  prevLevelXp: number;
  nextLevelXp: number;
}

interface Profile {
  username: string,
  currentXp: number;
  level: number;
  streak: number;
  avatarId: number;
}

interface PlayerStats {
  games: number;
  victories: number;
}
