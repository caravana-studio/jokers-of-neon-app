const seasonFromEnv = Number(import.meta.env.VITE_SEASON_NUMBER);

export const SEASON_NUMBER = Number.isFinite(seasonFromEnv) && seasonFromEnv > 0 ? seasonFromEnv : 1;
