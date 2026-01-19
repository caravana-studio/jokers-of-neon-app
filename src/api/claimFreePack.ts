const DEFAULT_API_BASE_URL = "http://localhost:3001";

type MintedCard = {
  recipient: string;
  pack_id: number;
  card_id: number;
  marketable: boolean;
  skin_id: number;
};

type ClaimFreePackApiResponse = {
  success?: boolean;
  transactionHash?: string;
  mintedCards?: MintedCard[];
};

export async function claimFreePack(recipient: string): Promise<MintedCard[]> {
  if (!recipient) {
    throw new Error("claimFreePack: recipient is required");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "claimFreePack: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/pack/free`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      recipient,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `claimFreePack: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: ClaimFreePackApiResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "claimFreePack: API responded without success flag set to true"
    );
  }

  if (!Array.isArray(json.mintedCards) || json.mintedCards.length === 0) {
    throw new Error("claimFreePack: No minted cards returned by API");
  }

  return json.mintedCards;
}
