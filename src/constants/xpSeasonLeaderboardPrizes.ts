import type { Prize } from "../queries/useTournamentSettings";

const createPrize = (
  packs: Partial<Prize["packs"]>,
  seasonPass = false
): Prize => ({
  packs: {
    base: 0,
    advanced: 0,
    epic: 0,
    legendary: 0,
    collector: 0,
    collectorXL: 0,
    ...packs,
  },
  seasonPass,
});

const assignPrizeRange = (
  target: Record<number, Prize>,
  start: number,
  end: number,
  prize: Prize
) => {
  for (let position = start; position <= end; position += 1) {
    target[position] = prize;
  }
};

const xpSeasonLeaderboardPrizes: Record<number, Prize> = {};

assignPrizeRange(
  xpSeasonLeaderboardPrizes,
  1,
  1,
  createPrize({ collectorXL: 1, legendary: 2, epic: 1 })
);
assignPrizeRange(
  xpSeasonLeaderboardPrizes,
  2,
  2,
  createPrize({ collector: 1, legendary: 2, epic: 1 })
);
assignPrizeRange(
  xpSeasonLeaderboardPrizes,
  3,
  3,
  createPrize({ legendary: 3, epic: 1 })
);
assignPrizeRange(
  xpSeasonLeaderboardPrizes,
  4,
  5,
  createPrize({ legendary: 2, epic: 1 })
);
assignPrizeRange(
  xpSeasonLeaderboardPrizes,
  6,
  10,
  createPrize({ legendary: 1, epic: 1 })
);
assignPrizeRange(
  xpSeasonLeaderboardPrizes,
  11,
  15,
  createPrize({ epic: 1, advanced: 1 })
);

export const XP_SEASON_LEADERBOARD_PRIZES = xpSeasonLeaderboardPrizes;
export const XP_SEASON_LEADERBOARD_LAST_PRIZE_POSITION = 15;
