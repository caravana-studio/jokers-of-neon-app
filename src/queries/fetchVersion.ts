import { APP_VERSION } from "../constants/version";

export const VERSION_URL =
  "https://jokersofneon.com/app/settings/version.json";
const FETCH_VERSION_TIMEOUT_MS = 6000;

export interface VersionResponse {
  version: string;
  maintenance?: boolean;
  slot?: Record<string, string>;
  api?: Record<string, string>;
}

const FALLBACK_VERSION_RESPONSE: VersionResponse = { version: APP_VERSION };
let fetchVersionPromise: Promise<VersionResponse> | null = null;

const isStringMap = (value: unknown): value is Record<string, string> => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.values(value).every((slot) => typeof slot === "string");
};

const normalizeVersionResponse = (data: unknown): VersionResponse => {
  if (!data || typeof data !== "object") {
    return FALLBACK_VERSION_RESPONSE;
  }

  const candidate = data as {
    version?: unknown;
    maintenance?: unknown;
    slot?: unknown;
    api?: unknown;
  };

  const version =
    typeof candidate.version === "string" && candidate.version.trim()
      ? candidate.version
      : APP_VERSION;

  return {
    version,
    maintenance:
      typeof candidate.maintenance === "boolean"
        ? candidate.maintenance
        : undefined,
    slot: isStringMap(candidate.slot) ? candidate.slot : undefined,
    api: isStringMap(candidate.api) ? candidate.api : undefined,
  };
};

export const fetchVersion = async (): Promise<VersionResponse> => {
  if (!fetchVersionPromise) {
    fetchVersionPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(
          () => controller.abort(),
          FETCH_VERSION_TIMEOUT_MS
        );
        let response: Response;

        try {
          response = await fetch(VERSION_URL, {
            cache: "no-store",
            signal: controller.signal,
          });
        } finally {
          window.clearTimeout(timeoutId);
        }

        if (!response.ok) {
          console.error("Failed to fetch version");
          return FALLBACK_VERSION_RESPONSE;
        }

        const data = await response.json();
        return normalizeVersionResponse(data);
      } catch (err) {
        console.error("Failed to fetch version. Unknown error occurred", err);
        return FALLBACK_VERSION_RESPONSE;
      }
    })();
  }

  return fetchVersionPromise;
};
