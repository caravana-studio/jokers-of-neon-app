const PACK_SIZE_BY_TIER: Record<number, number> = {
  1: 3,
  2: 3,
  3: 4,
  4: 4,
  5: 5,
  6: 10,
};

const PACK_PACKAGE_BASE_ID_BY_TIER: Record<number, string> = {
  1: "pack_basic",
  2: "pack_advanced",
  3: "pack_epic",
  4: "pack_legendary",
  5: "pack_collector",
  6: "pack_collector_xl",
};

const COLLECTOR_TIERS = new Set([5, 6]);

export const getPackTier = (packId: number): number => {
  if (!Number.isFinite(packId) || packId <= 0) {
    return 0;
  }

  return packId >= 20 ? packId % 10 : packId;
};

export const getPackSeason = (packId: number): number => {
  if (!Number.isFinite(packId) || packId <= 0) {
    return 1;
  }

  return packId >= 20 ? Math.floor(packId / 10) : 1;
};

export const getSeasonalPackId = (tier: number, season: number): number => {
  if (!Number.isFinite(tier) || tier <= 0) {
    return 0;
  }

  const normalizedTier = Math.floor(tier);
  const normalizedSeason =
    Number.isFinite(season) && season > 0 ? Math.floor(season) : 1;

  return normalizedSeason <= 1
    ? normalizedTier
    : normalizedSeason * 10 + normalizedTier;
};

export const getPackSize = (packId: number): number =>
  PACK_SIZE_BY_TIER[getPackTier(packId)] ?? 0;

export const isCollectorPackId = (packId: number): boolean =>
  COLLECTOR_TIERS.has(getPackTier(packId));

export const getPackPackageId = (
  packIdOrTier: number,
  season?: number
): string | null => {
  const tier = getPackTier(packIdOrTier) || Math.floor(packIdOrTier);
  const basePackageId = PACK_PACKAGE_BASE_ID_BY_TIER[tier];
  if (!basePackageId) {
    return null;
  }

  const resolvedSeason =
    season !== undefined ? season : getPackSeason(packIdOrTier);
  const normalizedSeason =
    Number.isFinite(resolvedSeason) && resolvedSeason > 0
      ? Math.floor(resolvedSeason)
      : 1;

  return normalizedSeason <= 1
    ? basePackageId
    : `${basePackageId}_s${normalizedSeason}`;
};

export const getSeasonPassPackageId = (season: number): string => {
  const normalizedSeason =
    Number.isFinite(season) && season > 0 ? Math.floor(season) : 1;

  return normalizedSeason <= 1
    ? "season_pass"
    : `season_pass_s${normalizedSeason}`;
};
