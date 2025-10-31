import { SEASON_NUMBER } from "../constants/season";

const DEFAULT_API_BASE_URL = "http://localhost:3001";

export type GetPlayerLivesParams = {
  playerAddress: string;
  seasonId?: number;
};

type PlayerLivesApiResponseRaw = {
  success?: boolean;
  data?: {
    player: string;
    season_id: string;
    available_lives: string;
    max_lives: string;
    next_live_timestamp?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type PlayerLivesApiResponse = {
  success?: boolean;
  data?: {
    player: string;
    season_id: string;
    available_lives: string;
    max_lives: string;
    next_live_timestamp?: Date;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export async function getPlayerLives({
  playerAddress,
  seasonId = SEASON_NUMBER,
}: GetPlayerLivesParams): Promise<PlayerLivesApiResponse> {
  if (!playerAddress) {
    throw new Error("getPlayerLives: playerAddress is required");
  }

  if (!Number.isFinite(seasonId)) {
    throw new Error("getPlayerLives: seasonId must be a finite number");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("getPlayerLives: Missing VITE_GAME_API_KEY environment variable");
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/lives/${encodeURIComponent(
    playerAddress
  )}/${seasonId}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `getPlayerLives: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    const json: PlayerLivesApiResponseRaw = await response.json();
    const timestamp = json.data?.next_live_timestamp?.trim() ?? "";
    const timestampNumber = Number(timestamp);
    const parsedTimestamp =
      Number.isFinite(timestampNumber) && timestampNumber > 0
        ? new Date(timestampNumber * 1000)
        : undefined;

    return {
      ...json,
      data: json.data
        ? {
            ...json.data,
            next_live_timestamp: parsedTimestamp,
          }
        : undefined,
    };
  } catch {
    throw new Error("getPlayerLives: Failed to parse response JSON");
  }
}
