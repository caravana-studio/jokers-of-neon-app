import { getSeasonNumber } from "../constants/season";
import { getGameApiBaseUrl } from "../config/gameApiUrl";
import {
  ensureGameLoopBurnerSession,
  getGameLoopBlockchain,
  isGameLoopBurnerEnabled,
} from "../utils/gameLoopBurner";

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

async function postCreateGame(
  requestUrl: string,
  apiKey: string,
  payload: CreateGamePayload
) {
  return fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });
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
  let resolvedUserAddress = userAddress;
  let blockchain = getGameLoopBlockchain();

  if (isGameLoopBurnerEnabled()) {
    const burnerSession = await ensureGameLoopBurnerSession();
    resolvedUserAddress = burnerSession.userAddress || resolvedUserAddress;
    blockchain = burnerSession.blockchain || blockchain;
  }

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

  let response = await postCreateGame(requestUrl, apiKey, payload);

  if (response.status === 409 && isGameLoopBurnerEnabled()) {
    await ensureGameLoopBurnerSession({ forceRefresh: true });
    response = await postCreateGame(requestUrl, apiKey, payload);
  }

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `createGame: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ""}`
    );
  }

  return response.json();
}
