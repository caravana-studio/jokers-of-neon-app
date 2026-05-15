import { getSeasonNumber } from "../../constants/season";
import { getGameApiBaseUrl } from "../../config/gameApiUrl";
import { ensureMiniAppSession, getMiniAppBlockchain } from "../session/useMiniAppSession";

type CreateMiniAppGameParams = {
  seasonId?: number;
  isTournament?: boolean;
  seed?: string;
};

interface CreateMiniAppPayload {
  user_address: string;
  season_id: number;
  is_tournament: boolean;
  blockchain: string;
  seed?: string;
}

async function postCreateGame(
  requestUrl: string,
  apiKey: string,
  payload: CreateMiniAppPayload
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

export async function createMiniAppGame({
  seasonId = getSeasonNumber(),
  isTournament = false,
  seed,
}: CreateMiniAppGameParams) {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "createMiniAppGame: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const requestUrl = `${getGameApiBaseUrl()}/api/game/create`;
  let session = await ensureMiniAppSession();
  const payload: CreateMiniAppPayload = {
    user_address: session.userAddress,
    season_id: seasonId,
    is_tournament: isTournament,
    blockchain: session.blockchain || getMiniAppBlockchain(),
  };

  if (seed) {
    payload.seed = seed;
  }

  let response = await postCreateGame(requestUrl, apiKey, payload);

  if (response.status === 409) {
    session = await ensureMiniAppSession({ forceRefresh: true });
    payload.user_address = session.userAddress;
    payload.blockchain = session.blockchain || getMiniAppBlockchain();
    response = await postCreateGame(requestUrl, apiKey, payload);
  }

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `createMiniAppGame: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  return response.json();
}
