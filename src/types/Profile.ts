interface ProfileData {
  levelXp: number;
  currentBadges: number;
  totalBadges: number;
  profilePicture: string | number;
  profile: Profile;
  playerStats: PlayerStats;
}

interface Profile {
  username: string,
  currentXp: number;
  level: number;
  streak: number;
}

interface PlayerStats {
  games: number;
  victories: number;
}