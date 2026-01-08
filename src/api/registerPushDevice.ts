const DEFAULT_API_BASE_URL = "http://localhost:3001";

export type PushPlatform = "ios" | "android";
export type PushLanguage = "es" | "en" | "pt";

export type RegisterPushDeviceParams = {
  wallet: string;
  fcmToken: string;
  platform: PushPlatform;
  timezone: string;
  language: PushLanguage;
};

type RegisterPushDeviceApiResponse = {
  success?: boolean;
};

const baseUrl = import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") || DEFAULT_API_BASE_URL;

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "registerPushDevice: Missing VITE_GAME_API_KEY environment variable"
    );
  }
  return apiKey;
}

export async function registerPushDevice({
  wallet,
  fcmToken,
  platform,
  timezone,
  language,
}: RegisterPushDeviceParams): Promise<RegisterPushDeviceApiResponse> {
  if (!wallet) {
    throw new Error("registerPushDevice: wallet is required");
  }
  if (!fcmToken) {
    throw new Error("registerPushDevice: fcmToken is required");
  }
  if (platform !== "ios" && platform !== "android") {
    throw new Error("registerPushDevice: platform must be ios or android");
  }
  if (!timezone) {
    throw new Error("registerPushDevice: timezone is required");
  }
  if (language !== "es" && language !== "en" && language !== "pt") {
    throw new Error("registerPushDevice: language must be es, en, or pt");
  }

  const apiKey = getApiKey();
  const requestUrl = `${baseUrl}/v1/push/devices/register`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      wallet,
      fcm_token: fcmToken,
      platform,
      timezone,
      language,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `registerPushDevice: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  try {
    return (await response.json()) as RegisterPushDeviceApiResponse;
  } catch {
    return { success: true };
  }
}
