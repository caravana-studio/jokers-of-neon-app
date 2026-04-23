import type { Prize } from "../queries/useTournamentSettings";

type PrizePackType = keyof Prize["packs"];

const PRIZE_PACK_TYPE_ORDER: PrizePackType[] = [
  "base",
  "advanced",
  "epic",
  "legendary",
  "collector",
  "collectorXL",
];

const PRIZE_PACK_TYPE_ID_SUFFIX: Record<PrizePackType, number> = {
  base: 1,
  advanced: 2,
  epic: 3,
  legendary: 4,
  collector: 5,
  collectorXL: 6,
};

const getPackIdForSeason = (seasonNumber: number, type: PrizePackType) => {
  const normalizedSeason = Number.isFinite(seasonNumber)
    ? Math.floor(seasonNumber)
    : 1;

  if (normalizedSeason <= 1) {
    return String(PRIZE_PACK_TYPE_ID_SUFFIX[type]);
  }

  return String(normalizedSeason * 10 + PRIZE_PACK_TYPE_ID_SUFFIX[type]);
};

export const getPrizePackIdsForSeason = (
  prize: Prize | undefined,
  seasonNumber: number
) => {
  if (!prize) {
    return [];
  }

  return PRIZE_PACK_TYPE_ORDER.flatMap((packType) => {
    const count = Math.max(0, Number(prize.packs[packType] ?? 0));
    if (!count) {
      return [];
    }

    return Array.from(
      { length: count },
      () => getPackIdForSeason(seasonNumber, packType),
    );
  });
};
