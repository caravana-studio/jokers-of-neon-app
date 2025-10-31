import { SEASON_NUMBER } from "../constants/season";

const DEFAULT_API_BASE_URL = "http://localhost:3001";
const DEFAULT_OPTIONAL_HEX = "0x0";

export type CreateGameParams = {
  userAddress: string;
  playerName: string;
  settingsId?: string;
  to?: string;
  seed?: string;
  seasonId?: number;
};

export async function createGame({
  userAddress,
  playerName,
  settingsId = DEFAULT_OPTIONAL_HEX,
  to,
  seed = DEFAULT_OPTIONAL_HEX,
  seasonId = SEASON_NUMBER,
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

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      user_address: userAddress,
      player_name: playerName,
      settings_id: settingsId,
      season_id: seasonId,
      to: to ?? userAddress,
      seed,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `createGame: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ""}`
    );
  }

  return response.json();
}
