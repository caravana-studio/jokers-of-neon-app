import { fetchVersion } from "../queries/fetchVersion";

const DEFAULT_API_BASE_URL = "http://localhost:3001";
const DEFAULT_ENV = "prod";

const configuredEnv = import.meta.env.VITE_ENV?.trim().toLowerCase() || DEFAULT_ENV;
const configuredApiUrl = import.meta.env.VITE_GAME_API_URL?.trim() || DEFAULT_API_BASE_URL;

let apiSource: "version-api" | "env" = "env";

export let gameApiUrl = configuredApiUrl;
export let gameApiBaseUrl = configuredApiUrl.replace(/\/+$/, "");

let preloadGameApiUrlPromise: Promise<void> | null = null;

export const getGameApiUrl = () => gameApiUrl;
export const getGameApiBaseUrl = () => gameApiBaseUrl;

export const preloadGameApiUrl = async () => {
  if (!preloadGameApiUrlPromise) {
    preloadGameApiUrlPromise = (async () => {
      const versionData = await fetchVersion();
      const apiUrlFromVersion = versionData.api?.[configuredEnv]?.trim();

      if (apiUrlFromVersion) {
        gameApiUrl = apiUrlFromVersion;
        apiSource = "version-api";
      }

      gameApiBaseUrl = gameApiUrl.replace(/\/+$/, "");

      console.info("[CONFIG-LOG] API URL configuration resolved", {
        env: configuredEnv,
        source: apiSource,
        apiUrl: gameApiUrl,
        apiBaseUrl: gameApiBaseUrl,
      });
    })();
  }

  await preloadGameApiUrlPromise;
};
