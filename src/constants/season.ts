import { useSyncExternalStore } from "react";

const DEFAULT_API_BASE_URL = "http://localhost:3001";

const seasonFromEnv = Number(import.meta.env.VITE_SEASON_NUMBER);
const fallbackSeasonNumber =
  Number.isFinite(seasonFromEnv) && seasonFromEnv > 0
    ? Math.floor(seasonFromEnv)
    : 1;

type CurrentSeasonApiResponse = {
  success?: boolean;
  season_id?: unknown;
};

let seasonNumber = fallbackSeasonNumber;
let preloadPromise: Promise<number> | null = null;
const listeners = new Set<() => void>();

const normalizeSeasonNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return Math.floor(parsed);
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const setSeasonNumber = (nextSeasonNumber: number) => {
  if (nextSeasonNumber === seasonNumber) {
    return;
  }

  seasonNumber = nextSeasonNumber;
  notifyListeners();
};

const getApiBaseUrl = () =>
  import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") || DEFAULT_API_BASE_URL;

export const getSeasonNumber = () => seasonNumber;

export const useSeasonNumber = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSeasonNumber,
    getSeasonNumber
  );

export const preloadCurrentSeasonId = async (): Promise<number> => {
  if (preloadPromise) {
    return preloadPromise;
  }

  const requestUrl = `${getApiBaseUrl()}/api/game/current-season-id`;
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  const headers = apiKey ? { "X-API-Key": apiKey } : undefined;

  preloadPromise = fetch(requestUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorDetails = await response.text().catch(() => "");
        throw new Error(
          `current-season-id: ${response.status} ${response.statusText}${
            errorDetails ? ` - ${errorDetails}` : ""
          }`
        );
      }

      const json = (await response.json()) as CurrentSeasonApiResponse;

      if (!json?.success) {
        throw new Error("current-season-id: response success flag is false");
      }

      const parsedSeason = normalizeSeasonNumber(json.season_id);
      if (!parsedSeason) {
        throw new Error("current-season-id: season_id is missing or invalid");
      }

      setSeasonNumber(parsedSeason);
      return parsedSeason;
    })
    .catch((error) => {
      console.warn(
        "[season] Failed to preload current season id. Falling back to local default.",
        error
      );
      return seasonNumber;
    });

  return preloadPromise;
};
