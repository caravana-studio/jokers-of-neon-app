import { SEASON_NUMBER } from "../constants/season";

const DEFAULT_API_BASE_URL = "http://localhost:3001";

export type CreateGameParams = {
  userAddress: string;
  playerName: string;
  seasonId?: number;
  isTournament?: boolean;
  seed?: string;
};

interface CreateGamePayload {
  user_address: string;
  player_name: string;
  season_id: number;
  is_tournament: boolean;
  seed?: string;
}

export async function createGame({
  userAddress,
  playerName,
  seasonId = SEASON_NUMBER,
  isTournament = false,
  seed,
}: CreateGameParams) {
  if (!userAddress) {
    throw new Error("createGame: userAddress is required");
  }

  if (!playerName) {
    throw new Error("createGame: playerName is required");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "createGame: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/game/create`;

  const payload: CreateGamePayload = {
    user_address: userAddress,
    player_name: playerName,
    season_id: seasonId,
    is_tournament: isTournament,
  };

  if (seed) {
    payload.seed = seed;
  }

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `createGame: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ""}`
    );
  }

  return response.json();
}
