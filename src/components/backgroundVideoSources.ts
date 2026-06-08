import { addSeasonSuffixToAssetPath } from "../utils/assetAvailability";

export type BackgroundVideoType =
  | "home"
  | "store"
  | "game"
  | "rage"
  | "rageboss"
  | "map"
  | "win"
  | "loose";

const tournamentVideoSources: Partial<Record<BackgroundVideoType, string>> = {
  home: "/bg/home-bg_t.mp4",
  store: "/bg/store-bg_t.mp4",
  game: "/bg/game-bg_t.mp4",
  rage: "/bg/rage-bg_t.mp4",
  map: "/bg/map-bg_t.mp4",
  rageboss: "/bg/rage-bg_t.mp4",
};

const defaultVideoSources: Record<BackgroundVideoType, string> = {
  home: "/bg/home-bg.mp4",
  store: "/bg/store-bg.mp4",
  game: "/bg/game-bg.mp4",
  rage: "/bg/rage-bg.mp4",
  // There is no default rage boss video. It falls back to rage unless a seasonal boss asset exists.
  rageboss: "/bg/rage-bg.mp4",
  map: "/bg/map-bg.mp4",
  win: "/bg/summary-bg.mp4",
  loose: "/bg/summary-bg.mp4",
};

const getBaseVideoSource = (
  type: BackgroundVideoType,
  useTournamentTheme: boolean
): string => {
  if (useTournamentTheme) {
    const tournamentVideo = tournamentVideoSources[type];
    if (tournamentVideo) return tournamentVideo;
  }

  return defaultVideoSources[type];
};

const appendUniqueSource = (sources: string[], source: string) => {
  if (!sources.includes(source)) {
    sources.push(source);
  }
};

export const getVideoSourceCandidates = (
  type: BackgroundVideoType,
  useTournamentTheme: boolean,
  seasonNumber: number
) => {
  const fallbackType = type === "rageboss" ? "rage" : type;
  const fallbackSource = getBaseVideoSource(fallbackType, useTournamentTheme);
  const candidates: string[] = [];

  if (type === "rageboss") {
    appendUniqueSource(
      candidates,
      addSeasonSuffixToAssetPath(
        useTournamentTheme ? "/bg/rage-boss-bg_t.mp4" : "/bg/rage-boss-bg.mp4",
        seasonNumber
      )
    );
  }

  appendUniqueSource(
    candidates,
    addSeasonSuffixToAssetPath(fallbackSource, seasonNumber)
  );
  appendUniqueSource(candidates, fallbackSource);

  return candidates;
};
