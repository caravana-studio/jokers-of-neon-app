import { getSeasonNumber } from "../constants/season";
import { getGameApiBaseUrl } from "../config/gameApiUrl";
import { ensureGameLoopBurnerSession } from "../utils/gameLoopBurner";

export type CreateGameParams = {
  userAddress: string;
  seasonId?: number;
  isTournament?: boolean;
  seed?: string;
};

interface CreateGamePayload {
  user_address: string;
  season_id: number;
  is_tournament: boolean;
  blockchain: string;
  seed?: string;
}

export async function createGame({
  userAddress,
  seasonId = getSeasonNumber(),
  isTournament = false,
  seed,
}: CreateGameParams) {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "createGame: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl = getGameApiBaseUrl();
  const requestUrl = `${baseUrl}/api/game/create`;
  const burnerSession = await ensureGameLoopBurnerSession();
  const blockchain =
    burnerSession.blockchain || import.meta.env.VITE_BLOCKCHAIN?.trim() || "starknet";
  const resolvedUserAddress = burnerSession.userAddress || userAddress;

  if (!resolvedUserAddress) {
    throw new Error("createGame: userAddress is required");
  }

  const payload: CreateGamePayload = {
    user_address: resolvedUserAddress,
    season_id: seasonId,
    is_tournament: isTournament,
    blockchain,
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
