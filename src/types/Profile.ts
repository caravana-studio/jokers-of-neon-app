interface ProfileData {
  levelXp: number;
  currentBadges: number;
  totalBadges: number;
  profile: Profile;
  playerStats: PlayerStats;
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