const DEFAULT_API_BASE_URL = "http://localhost:3001";

type NextFreePackResponse = {
  success?: boolean;
  nextTimestamp?: string;
};

interface FreePackResponse {
  nextTime?: Date;
  canClaim: boolean;
}

export async function getNextFreePackTime(
  userAddress: string
): Promise<FreePackResponse> {
  if (!userAddress) {
    throw new Error("getNextFreePackTime: userAddress is required");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "getNextFreePackTime: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/pack/free/next-timestamp/${encodeURIComponent(
    userAddress
  )}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `getNextFreePackTime: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: NextFreePackResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "getNextFreePackTime: API responded without success flag set to true"
    );
  }

  const epochSeconds = Number(json.nextTimestamp);

  if (!Number.isFinite(epochSeconds)) {
    throw new Error(
      "getNextFreePackTime: Invalid nextTimestamp value returned by API"
    );
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const canClaim = epochSeconds === 0 || epochSeconds <= nowSeconds;

  return {
    canClaim,
    nextTime:
      !canClaim && epochSeconds > 0 ? new Date(epochSeconds * 1000) : undefined,
  };
}
