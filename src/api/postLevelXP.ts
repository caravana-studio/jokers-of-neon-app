const DEFAULT_API_BASE_URL = "http://localhost:3001";

export type PostLevelXPParams = {
  address: string;
  level: number;
};

type PostLevelXPApiResponse = {
  success?: boolean;
  transactionHash?: string;
};

export type PostLevelXPResult = {
  success: true;
  transactionHash: string;
};

export async function postLevelXP({
  address,
  level,
}: PostLevelXPParams): Promise<PostLevelXPResult> {
  if (!address) {
    throw new Error("postLevelXP: address is required");
  }

  if (!Number.isInteger(level) || level < 1) {
    throw new Error("postLevelXP: level must be a positive integer");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "postLevelXP: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/xp/level-completion`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      address,
      level,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `postLevelXP: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: PostLevelXPApiResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "postLevelXP: API responded without success flag set to true"
    );
  }

  if (!json.transactionHash) {
    throw new Error("postLevelXP: Missing transaction hash in API response");
  }

  return {
    success: true,
    transactionHash: json.transactionHash,
  };
}
