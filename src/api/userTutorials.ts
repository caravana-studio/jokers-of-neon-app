const DEFAULT_API_BASE_URL = "http://localhost:3001";

export type PatchUserTutorialsPayload = {
  complete_ids?: string[];
  reset_ids?: string[];
  source?: string;
  app_version?: string;
  platform?: string;
};

type UserTutorialsApiResponse =
  | {
      completed_ids?: string[];
      data?: {
        completed_ids?: string[];
      };
    }
  | null
  | undefined;

const baseUrl =
  import.meta.env.VITE_GAME_API_URL?.replace(/\/+$/, "") ||
  DEFAULT_API_BASE_URL;

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("userTutorials: Missing VITE_GAME_API_KEY environment variable");
  }
  return apiKey;
}

const normalizeCompletedIds = (payload: UserTutorialsApiResponse): string[] => {
  const direct = payload?.completed_ids;
  if (Array.isArray(direct)) {
    return direct.filter((id): id is string => typeof id === "string" && id.length > 0);
  }

  const nested = payload?.data?.completed_ids;
  if (Array.isArray(nested)) {
    return nested.filter((id): id is string => typeof id === "string" && id.length > 0);
  }

  return [];
};

const defaultHeaders = (apiKey: string) => ({
  "Content-Type": "application/json",
  "X-API-Key": apiKey,
});

export async function getUserTutorials(wallet: string): Promise<string[]> {
  if (!wallet) {
    throw new Error("getUserTutorials: wallet is required");
  }

  const apiKey = getApiKey();
  const requestUrl = `${baseUrl}/v1/user/tutorials/${encodeURIComponent(wallet)}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: defaultHeaders(apiKey),
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `getUserTutorials: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    const payload = (await response.json()) as UserTutorialsApiResponse;
    return normalizeCompletedIds(payload);
  } catch {
    return [];
  }
}

export async function patchUserTutorials(
  wallet: string,
  payload: PatchUserTutorialsPayload
): Promise<string[]> {
  if (!wallet) {
    throw new Error("patchUserTutorials: wallet is required");
  }

  const apiKey = getApiKey();
  const requestUrl = `${baseUrl}/v1/user/tutorials/${encodeURIComponent(wallet)}`;

  const response = await fetch(requestUrl, {
    method: "PATCH",
    headers: defaultHeaders(apiKey),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `patchUserTutorials: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    const data = (await response.json()) as UserTutorialsApiResponse;
    return normalizeCompletedIds(data);
  } catch {
    return [];
  }
}
