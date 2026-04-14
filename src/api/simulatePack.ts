import { getGameApiBaseUrl } from "../config/gameApiUrl";

export type SimulatePackParams = {
  packId: number;
  recipient: string;
};

export type SimulatePackResponse = {
  success: boolean;
  mintedCards?: { card_id: number; skin_id: number }[];
  seed?: string;
  error?: string;
};

export async function simulatePack({
  packId,
  recipient,
}: SimulatePackParams): Promise<SimulatePackResponse> {
  if (packId === undefined || packId === null) {
    throw new Error("simulatePack: packId is required");
  }

  if (!recipient) {
    throw new Error("simulatePack: recipient is required");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "simulatePack: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl = getGameApiBaseUrl();
  const requestUrl = `${baseUrl}/api/pack/simulate`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      pack_id: packId,
      recipient,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `simulatePack: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ""}`
    );
  }

  const json: SimulatePackResponse = await response.json();

  if (!json.success) {
    throw new Error(json.error ?? "simulatePack: Unknown error");
  }

  if (!json.mintedCards || json.mintedCards.length === 0) {
    throw new Error("simulatePack: No cards returned");
  }

  return json;
}
