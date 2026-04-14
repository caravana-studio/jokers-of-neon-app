import { getGameApiBaseUrl } from "../config/gameApiUrl";

export type MintPackParams = {
  packId: number;
  recipient: string;
};

export async function mintPack({ packId, recipient }: MintPackParams) {
  if (packId === undefined || packId === null) {
    throw new Error("mintPack: packId is required");
  }

  if (!recipient) {
    throw new Error("mintPack: recipient is required");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("mintPack: Missing VITE_GAME_API_KEY environment variable");
  }

  const baseUrl = getGameApiBaseUrl();
  const requestUrl = `${baseUrl}/api/pack/mint`;

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
      `mintPack: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ""}`
    );
  }

  const json = await response.json();

  if (!json.mintedCards || json.mintedCards.length === 0) {
    throw new Error("mintPack: No cards minted");
  }

  return json.mintedCards;
}
