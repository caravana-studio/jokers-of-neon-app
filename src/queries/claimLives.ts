import { SEASON_NUMBER } from "../constants/season";

const DEFAULT_API_BASE_URL = "http://localhost:3001";
const DEFAULT_SEASON_ID = SEASON_NUMBER;

export type ClaimLivesParams = {
  playerAddress: string;
  seasonId?: number;
};

export type ClaimLivesApiResponse = {
  success: boolean;
  transactionHash: string;
};

export async function claimLives({
  playerAddress,
  seasonId = DEFAULT_SEASON_ID,
}: ClaimLivesParams): Promise<ClaimLivesApiResponse> {
  if (!playerAddress) {
    throw new Error("claimLives: playerAddress is required");
  }

  if (!Number.isFinite(seasonId)) {
    throw new Error("claimLives: seasonId must be a finite number");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("claimLives: Missing VITE_GAME_API_KEY environment variable");
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/lives/claim`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      player_address: playerAddress,
      season_id: seasonId,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `claimLives: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    const json: ClaimLivesApiResponse = await response.json();
    return json;
  } catch (error) {
    throw new Error("claimLives: Failed to parse response JSON");
  }
}

