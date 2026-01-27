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

export type SkinPreferences = Record<string, number>;

type UserPreferencesApiResponse =
  | UserPreferences
  | {
      data?: UserPreferences;
    };

type SkinPreferencesApiResponse = {
  success?: boolean;
  data?: Record<string, { skin?: number }>;
  error?: string;
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

const normalizeSkinValue = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.trunc(parsed);
};

function extractSkinPreferences(payload: unknown): SkinPreferences {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  if ("success" in payload) {
    const { success, error, data } = payload as SkinPreferencesApiResponse;
    if (success === false) {
      const message =
        typeof error === "string" && error.trim().length > 0
          ? error
          : "Unknown error";
      throw new Error(`skinPreferences: ${message}`);
    }
    if (!data || typeof data !== "object") {
      return {};
    }

    const entries = Object.entries(
      data as Record<string, { skin?: number } | null | undefined>
    );
    return entries.reduce<SkinPreferences>((acc, [cardId, entry]) => {
      const skinValue =
        entry && typeof entry === "object" && "skin" in entry
          ? entry.skin
          : null;
      const normalized = normalizeSkinValue(skinValue);
      if (normalized === null) {
        return acc;
      }
      acc[cardId] = normalized;
      return acc;
    }, {});
  }

  const entries = Object.entries(
    payload as Record<string, { skin?: number } | null | undefined>
  );

  return entries.reduce<SkinPreferences>((acc, [cardId, entry]) => {
    const skinValue =
      entry && typeof entry === "object" && "skin" in entry
        ? entry.skin
        : null;
    const normalized = normalizeSkinValue(skinValue);
    if (normalized === null) {
      return acc;
    }
    acc[cardId] = normalized;
    return acc;
  }, {});
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

export async function getUserSkinPreferences(
  userAddress: string
): Promise<SkinPreferences> {
  if (!userAddress) {
    throw new Error("getUserSkinPreferences: userAddress is required");
  }
  const apiKey = getApiKey();
  const requestUrl = `${baseUrl}/v1/user/preferences/${encodeURIComponent(
    userAddress
  )}/skins`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
  });

  if (response.status === 404) {
    return {};
  }

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `getUserSkinPreferences: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    const payload = (await response.json()) as SkinPreferencesApiResponse;
    return extractSkinPreferences(payload);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`getUserSkinPreferences: Failed to parse response JSON`);
  }
}

export async function updateUserSkinPreference(
  userAddress: string,
  cardId: string | number,
  skinId: number
): Promise<SkinPreferences> {
  if (!userAddress) {
    throw new Error("updateUserSkinPreference: userAddress is required");
  }

  const normalizedCardId = String(cardId).trim();
  if (!normalizedCardId) {
    throw new Error("updateUserSkinPreference: cardId is required");
  }

  if (Number.isNaN(Number(skinId))) {
    throw new Error("updateUserSkinPreference: skinId must be a number");
  }

  const apiKey = getApiKey();
  const requestUrl = `${baseUrl}/v1/user/preferences/${encodeURIComponent(
    userAddress
  )}/skins`;

  const response = await fetch(requestUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      [normalizedCardId]: {
        skin: Math.trunc(Number(skinId)),
      },
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `updateUserSkinPreference: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    const payload = (await response.json()) as SkinPreferencesApiResponse;
    return extractSkinPreferences(payload);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "updateUserSkinPreference: Failed to parse response JSON"
    );
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
