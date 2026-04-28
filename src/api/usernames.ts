import { getGameApiBaseUrl } from "../config/gameApiUrl";
import { addressKey, normalizeStarknetAddress } from "../utils/starknetAddress";

export type UsernameRecord = {
  address: string;
  username: string;
  username_normalized: string;
  created_at?: string;
  updated_at?: string;
};

type UsernameApiResponse = {
  success?: boolean;
  data?: UsernameRecord;
  code?: string;
  error?: string;
};

type UsernameBatchResponse = {
  success?: boolean;
  data?: UsernameRecord[];
  code?: string;
  error?: string;
};

type UsernameAvailabilityResponse = {
  success?: boolean;
  data?: {
    username: string;
    available: boolean;
  };
  code?: string;
  error?: string;
};

export class UsernameApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const USERNAME_PATTERN = /^[A-Za-z0-9._-]+$/;

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("usernamesApi: Missing VITE_GAME_API_KEY environment variable");
  }
  return apiKey;
}

function getBaseUrl(): string {
  return getGameApiBaseUrl();
}

async function parseError(response: Response): Promise<UsernameApiError> {
  const text = await response.text().catch(() => "");
  try {
    const json = JSON.parse(text) as { error?: string; code?: string };
    return new UsernameApiError(
      response.status,
      json.error || response.statusText,
      json.code
    );
  } catch {
    return new UsernameApiError(
      response.status,
      text || response.statusText
    );
  }
}

export function validateUsername(username: string): string {
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 15) {
    throw new UsernameApiError(400, "Username must be 3-15 characters", "INVALID_USERNAME");
  }
  if (!USERNAME_PATTERN.test(trimmed)) {
    throw new UsernameApiError(
      400,
      'Username can only contain letters, numbers, ".", "_" and "-"',
      "INVALID_USERNAME"
    );
  }
  return trimmed;
}

export async function fetchUsernameByAddress(
  address: string
): Promise<UsernameRecord | null> {
  const apiKey = getApiKey();
  const requestUrl = `${getBaseUrl()}/v1/usernames/address/${encodeURIComponent(
    normalizeStarknetAddress(address)
  )}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  const json = (await response.json()) as UsernameApiResponse;
  if (!json.success || !json.data) {
    throw new UsernameApiError(500, "Invalid username response");
  }
  return json.data;
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const apiKey = getApiKey();
  const validUsername = validateUsername(username);
  const requestUrl = `${getBaseUrl()}/v1/usernames/available/${encodeURIComponent(
    validUsername
  )}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const json = (await response.json()) as UsernameAvailabilityResponse;
  if (!json.success || !json.data) {
    throw new UsernameApiError(500, "Invalid username availability response");
  }
  return json.data.available;
}

export async function resolveUsernames(
  addresses: string[]
): Promise<UsernameRecord[]> {
  if (addresses.length === 0) {
    return [];
  }

  const apiKey = getApiKey();
  const response = await fetch(`${getBaseUrl()}/v1/usernames/resolve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      addresses: Array.from(new Set(addresses.map(normalizeStarknetAddress))),
    }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const json = (await response.json()) as UsernameBatchResponse;
  if (!json.success || !Array.isArray(json.data)) {
    throw new UsernameApiError(500, "Invalid username batch response");
  }
  return json.data;
}

export async function resolveUsernameMap(
  addresses: string[]
): Promise<Map<string, string>> {
  const records = await resolveUsernames(addresses);
  return new Map(records.map((record) => [addressKey(record.address), record.username]));
}

export async function createUsername(
  address: string,
  username: string
): Promise<UsernameRecord> {
  const apiKey = getApiKey();
  const validUsername = validateUsername(username);

  const response = await fetch(`${getBaseUrl()}/v1/usernames`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      address: normalizeStarknetAddress(address),
      username: validUsername,
    }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const json = (await response.json()) as UsernameApiResponse;
  if (!json.success || !json.data) {
    throw new UsernameApiError(500, "Invalid username create response");
  }
  return json.data;
}

export async function updateUsername(
  address: string,
  username: string
): Promise<UsernameRecord> {
  const apiKey = getApiKey();
  const validUsername = validateUsername(username);
  const response = await fetch(
    `${getBaseUrl()}/v1/usernames/${encodeURIComponent(
      normalizeStarknetAddress(address)
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        username: validUsername,
      }),
    }
  );

  if (!response.ok) {
    throw await parseError(response);
  }

  const json = (await response.json()) as UsernameApiResponse;
  if (!json.success || !json.data) {
    throw new UsernameApiError(500, "Invalid username update response");
  }
  return json.data;
}

export function isUsernameRequiredError(error: unknown): boolean {
  return error instanceof UsernameApiError && error.code === "USERNAME_REQUIRED";
}
