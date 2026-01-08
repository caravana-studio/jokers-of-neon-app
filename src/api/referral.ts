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
 * Generates a referral link using the username
 * Format: jokersofneon.com?ref=username
 * 
 * This link should redirect to AppsFlyer OneLink which will:
 * 1. Redirect to App Store if app not installed
 * 2. Open app with deep link if app is installed
 * 
 * @param referralCode - The referral code (username)
 * @param referrerAddress - Optional referrer address for AppsFlyer deep link
 * @returns The referral link
 */
export function generateReferralLink(
  referralCode: string,
  referrerAddress?: string
): string {
  // Base URL - this should be your domain
  const baseUrl = "https://jokersofneon.com";
  
  // Simple referral link format
  const referralLink = `${baseUrl}?ref=${encodeURIComponent(referralCode)}`;
  
  return referralLink;
}

/**
 * Generates an AppsFlyer OneLink for referral
 * This is the actual deep link that AppsFlyer will process
 * 
 * @param referralCode - The referral code (username)
 * @param referrerAddress - Referrer's Starknet address
 * @param oneLinkId - Your AppsFlyer OneLink ID (from dashboard)
 * @returns The AppsFlyer OneLink URL
 */
export function generateAppsFlyerOneLink(
  referralCode: string,
  referrerAddress: string,
  oneLinkId?: string
): string {
  // Get OneLink ID from env or use default
  const linkId = oneLinkId || import.meta.env.VITE_APPSFLYER_ONELINK_ID || "YOUR_ONELINK_ID";
  
  // AppsFlyer OneLink format
  const baseUrl = `https://app.appsflyer.com/${linkId}`;
  
  // Parameters for deep linking
  const params = new URLSearchParams({
    deep_link_value: "referral",
    deep_link_sub1: referralCode, // username
    deep_link_sub2: referrerAddress, // referrer address
    campaign: "referral",
    media_source: "user_invite"
  });
  
  return `${baseUrl}?${params.toString()}`;
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
