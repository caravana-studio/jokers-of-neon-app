const DEFAULT_API_BASE_URL = "http://localhost:3001";

export type UserPreferences = {
  wallet?: string;
  push_daily_missions_enabled: boolean;
  push_reminders_enabled: boolean;
  push_events_enabled: boolean;
  push_daily_packs_enabled: boolean;
  push_extra1_enabled: boolean;
  push_extra2_enabled: boolean;
  timezone: string;
  language: string;
  sound_volume: number;
  music_volume: number;
  animation_speed: string;
  loot_box_transition: string;
};

export type UserPreferencesPatch = Partial<Omit<UserPreferences, "wallet">>;

type UserPreferencesApiResponse =
  | UserPreferences
  | {
      data?: UserPreferences;
    };

const baseUrl =
  import.meta.env.VITE_GAME_API_URL?.replace(/\/+$/, "") ||
  DEFAULT_API_BASE_URL;

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "userPreferences: Missing VITE_GAME_API_KEY environment variable"
    );
  }
  return apiKey;
}

function extractPreferences(
  payload: UserPreferencesApiResponse
): UserPreferences {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data?: UserPreferences }).data
  ) {
    return (payload as { data: UserPreferences }).data;
  }
  return payload as UserPreferences;
}

export async function getUserPreferences(
  wallet: string
): Promise<UserPreferences | null> {
  if (!wallet) {
    throw new Error("getUserPreferences: wallet is required");
  }
  const apiKey = getApiKey();
  const requestUrl = `${baseUrl}/v1/user/preferences/${encodeURIComponent(
    wallet
  )}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `getUserPreferences: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    const payload = (await response.json()) as UserPreferencesApiResponse;
    return extractPreferences(payload);
  } catch (error) {
    throw new Error(`getUserPreferences: Failed to parse response JSON`);
  }
}

export async function patchUserPreferences(
  wallet: string,
  patch: UserPreferencesPatch
): Promise<UserPreferences | null> {
  if (!wallet) {
    throw new Error("patchUserPreferences: wallet is required");
  }
  const apiKey = getApiKey();
  const requestUrl = `${baseUrl}/v1/user/preferences/${encodeURIComponent(
    wallet
  )}`;

  const response = await fetch(requestUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `patchUserPreferences: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    const payload = (await response.json()) as UserPreferencesApiResponse;
    return extractPreferences(payload);
  } catch {
    return null;
  }
}
