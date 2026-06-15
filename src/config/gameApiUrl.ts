import { fetchVersion } from "../queries/fetchVersion";

const DEFAULT_API_BASE_URL = "http://localhost:3001";
const DEFAULT_ENV = "prod";

const configuredEnv = import.meta.env.VITE_ENV?.trim().toLowerCase() || DEFAULT_ENV;
const configuredApiUrl = import.meta.env.VITE_GAME_API_URL?.trim() || DEFAULT_API_BASE_URL;
const KNOWN_API_URLS: Record<string, string> = {
  "aws-testnet": "https://testnet-jokers-of-neon-api.onrender.com",
};

let apiSource: "version-api" | "known-api" | "env" = "env";

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
      const knownApiUrl = KNOWN_API_URLS[configuredEnv];

      if (apiUrlFromVersion) {
        gameApiUrl = apiUrlFromVersion;
        apiSource = "version-api";
      } else if (
        knownApiUrl &&
        (!import.meta.env.VITE_GAME_API_URL?.trim() ||
          configuredApiUrl === DEFAULT_API_BASE_URL)
      ) {
        gameApiUrl = knownApiUrl;
        apiSource = "known-api";
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
