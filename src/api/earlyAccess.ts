type EarlyAccessResponse = {
  registered?: boolean;
};

function getApiKey(): string {
  const apiKey =
    import.meta.env.VITE_API_KEY ?? import.meta.env.VITE_GAME_API_KEY;

  if (!apiKey) {
    throw new Error(
      "checkEarlyAccess: Missing API key (set VITE_API_KEY or VITE_GAME_API_KEY)"
    );
  }

  return apiKey;
}

function getApiBaseUrl(): string {
  const apiBase =
    import.meta.env.VITE_API ??
    import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_GAME_API_URL;

  if (!apiBase) {
    throw new Error(
      "checkEarlyAccess: Missing API base URL (set VITE_API or VITE_API_URL)"
    );
  }

  return String(apiBase).replace(/\/$/, "");
}

export async function checkEarlyAccess(
  address: string,
  signal?: AbortSignal
): Promise<boolean> {
  if (!address) {
    throw new Error("checkEarlyAccess: address is required");
  }

  const apiKey = getApiKey();
  const baseUrl = getApiBaseUrl();
  const requestUrl = `${baseUrl}/api/early_access/check/${encodeURIComponent(
    address
  )}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    signal,
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `checkEarlyAccess: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: EarlyAccessResponse = await response.json().catch(() => ({}));

  if (typeof json.registered !== "boolean") {
    throw new Error(
      "checkEarlyAccess: API did not return a valid registered boolean"
    );
  }

  return json.registered;
}
