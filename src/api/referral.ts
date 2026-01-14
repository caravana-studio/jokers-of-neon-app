const DEFAULT_API_BASE_URL = "http://localhost:3001";

/**
 * Creates or gets a referral code for a user
 * @param userAddress - User's Starknet address
 * @param username - Optional username. If not provided, will be fetched from profile
 */
export async function createReferralCode(
  userAddress: string,
  username?: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GAME_API_KEY environment variable");
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/referral/create-code`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      user_address: userAddress,
      username: username,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `createReferralCode: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json = await response.json();

  if (!json.success || !json.referral_code) {
    throw new Error("createReferralCode: API did not return a valid referral code");
  }

  return json.referral_code;
}

/**
 * Generates an AppsFlyer OneLink for referral
 * This link will:
 * 1. Redirect to App Store if app not installed
 * 2. Open app with deep link if app is installed
 *
 * @param referralCode - The referral code (username)
 * @returns The AppsFlyer OneLink URL
 */
export function generateReferralLink(referralCode: string): string {
  const oneLinkBaseUrl = "https://jokersofneon.onelink.me/2BD9";
  return `${oneLinkBaseUrl}?ref=${encodeURIComponent(referralCode)}`;
}

/**
 * Gets referral statistics for a user
 */
export async function getReferralStats(userAddress: string) {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GAME_API_KEY environment variable");
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/referral/stats/${encodeURIComponent(userAddress)}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `getReferralStats: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error("getReferralStats: API did not return success");
  }

  return json.data;
}

/**
 * Registers a milestone achieved by a referred user
 */
export async function registerMilestone(
  userAddress: string,
  milestoneType: string,
  milestoneValue?: number
): Promise<void> {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GAME_API_KEY environment variable");
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/referral/milestone`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      user_address: userAddress,
      milestone_type: milestoneType,
      milestone_value: milestoneValue,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `registerMilestone: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error("registerMilestone: API did not return success");
  }
}

/**
 * Checks and distributes rewards for a referrer
 */
export async function checkAndDistributeRewards(referrerAddress: string): Promise<void> {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GAME_API_KEY environment variable");
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/referral/check-rewards`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      referrer_address: referrerAddress,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `checkAndDistributeRewards: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error("checkAndDistributeRewards: API did not return success");
  }
}
