import { Capacitor, registerPlugin } from "@capacitor/core";

// =============================================================================
// APPSFLYER EVENTS
// =============================================================================

export const AppsFlyerEvents = {
  // Account
  ACCOUNT_CREATED: "jn_account_created",
  LOGIN: "jn_login",

  // Game lifecycle
  GAME_STARTED: "jn_game_started",
  GAME_COMPLETED: "jn_game_completed",
  GAME_WON: "jn_game_won",
  GAME_LOST: "jn_game_lost",
  LEVEL_ACHIEVED: "jn_level_achieved",
  ROUND_COMPLETED: "jn_round_completed",

  // Progression
  PROFILE_LEVEL_UP: "jn_profile_level_up",
  DAILY_MISSION_COMPLETED: "jn_daily_mission_completed",
  ACHIEVEMENT_UNLOCKED: "jn_achievement_unlocked",

  // Store/Purchases
  PACK_OPENED: "jn_pack_opened",
  PACK_PURCHASED: "jn_pack_purchased",
  CARD_PURCHASED: "jn_card_purchased",
  SEASON_PASS_PURCHASED: "jn_season_pass_purchased",
  POWERUP_PURCHASED: "jn_powerup_purchased",

  // Social/Referral
  REFERRAL_CODE_SHARED: "jn_referral_code_shared",
  REFERRAL_CODE_USED: "jn_referral_code_used",

  // Tutorial
  TUTORIAL_STARTED: "jn_tutorial_started",
  TUTORIAL_COMPLETED: "jn_tutorial_completed",
} as const;

// =============================================================================
// PLUGIN INTERFACE & REGISTRATION
// =============================================================================

interface GenerateInviteUrlOptions {
  referralCode: string;
  referrerAddress: string;
  channel?: string;
  campaign?: string;
}

interface LogInviteOptions {
  channel?: string;
  referralCode: string;
  referrerAddress: string;
}

interface AppsFlyerBridgePlugin {
  setCustomerUserId(options: { customerUserId: string }): Promise<void>;
  logEvent(options: { eventName: string; eventValues?: Record<string, unknown> }): Promise<void>;
  getAppsFlyerUID(): Promise<{ uid: string }>;
  getDeviceId(): Promise<{ deviceId: string }>;
  generateInviteUrl(options: GenerateInviteUrlOptions): Promise<{ url: string }>;
  logInvite(options: LogInviteOptions): Promise<void>;
  addListener(
    eventName: "conversionData" | "deepLink",
    listenerFunc: (data: { data: string }) => void
  ): Promise<{ remove: () => void }>;
}

// Web stub for non-native platforms
class AppsFlyerBridgeWeb implements Partial<AppsFlyerBridgePlugin> {
  async setCustomerUserId(): Promise<void> {}
  async logEvent(): Promise<void> {}
  async getAppsFlyerUID(): Promise<{ uid: string }> {
    return { uid: "" };
  }
  async getDeviceId(): Promise<{ deviceId: string }> {
    return { deviceId: "" };
  }
  async generateInviteUrl(): Promise<{ url: string }> {
    return { url: "" };
  }
  async logInvite(): Promise<void> {}
  async addListener(): Promise<{ remove: () => void }> {
    return { remove: () => {} };
  }
}

const AppsFlyerBridge = registerPlugin<AppsFlyerBridgePlugin>("AppsFlyerBridge", {
  web: () => Promise.resolve(new AppsFlyerBridgeWeb() as AppsFlyerBridgePlugin),
});

// =============================================================================
// CORE SDK FUNCTIONS
// =============================================================================

const isNative = () => Capacitor.isNativePlatform();

/**
 * Set Customer User ID (CUID) - links AppsFlyer data to your user
 * Call this when user logs in or creates account
 */
export async function setAppsFlyerCustomerUserId(userAddress: string): Promise<void> {
  if (!isNative()) {
    console.log("[AppsFlyer] Web - skipping setCustomerUserId");
    return;
  }

  try {
    await AppsFlyerBridge.setCustomerUserId({ customerUserId: userAddress });
    console.log("[AppsFlyer] CUID set:", userAddress);
  } catch (error) {
    console.error("[AppsFlyer] Failed to set CUID:", error);
  }
}

/**
 * Log a custom event to AppsFlyer
 */
export async function logAppsFlyerEvent(
  eventName: string,
  eventValues?: Record<string, unknown>
): Promise<void> {
  if (!isNative()) {
    console.log(`[AppsFlyer] Web - event: ${eventName}`, eventValues);
    return;
  }

  try {
    await AppsFlyerBridge.logEvent({ eventName, eventValues: eventValues ?? {} });
    console.log(`[AppsFlyer] Event: ${eventName}`, eventValues);
  } catch (error) {
    console.error(`[AppsFlyer] Event failed (${eventName}):`, error);
  }
}

/**
 * Get AppsFlyer UID - unique device identifier
 */
export async function getAppsFlyerUID(): Promise<string | null> {
  if (!isNative()) return null;

  try {
    const result = await AppsFlyerBridge.getAppsFlyerUID();
    return result.uid || null;
  } catch (error) {
    console.error("[AppsFlyer] Failed to get UID:", error);
    return null;
  }
}

/**
 * Get Device ID (IDFV on iOS, Android ID on Android)
 */
export async function getDeviceId(): Promise<string | null> {
  if (!isNative()) return null;

  try {
    const result = await AppsFlyerBridge.getDeviceId();
    return result.deviceId || null;
  } catch (error) {
    console.error("[AppsFlyer] Failed to get Device ID:", error);
    return null;
  }
}

// =============================================================================
// EVENT HELPERS - Typed helpers for common events
// =============================================================================

export const AppsFlyerHelpers = {
  // Account
  logAccountCreated: (userAddress: string, username: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.ACCOUNT_CREATED, { user_address: userAddress, username }),

  logLogin: (userAddress: string, loginMethod: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.LOGIN, { user_address: userAddress, login_method: loginMethod }),

  // Game lifecycle
  logGameStarted: (gameId: number, gameMode: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.GAME_STARTED, { game_id: gameId, game_mode: gameMode }),

  logGameCompleted: (gameId: number, score: number, level: number, won: boolean) =>
    logAppsFlyerEvent(AppsFlyerEvents.GAME_COMPLETED, {
      game_id: gameId,
      score,
      level,
      won: won ? 1 : 0,
    }),

  logGameWon: (gameId: number, score: number, level: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.GAME_WON, { game_id: gameId, score, level }),

  logGameLost: (gameId: number, score: number, level: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.GAME_LOST, { game_id: gameId, score, level }),

  logLevelAchieved: (level: number, score: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.LEVEL_ACHIEVED, { level, score }),

  logRoundCompleted: (round: number, score: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.ROUND_COMPLETED, { round, score }),

  // Progression
  logProfileLevelUp: (level: number, totalXp: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.PROFILE_LEVEL_UP, { level, total_xp: totalXp }),

  logDailyMissionCompleted: (missionId: string, difficulty: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.DAILY_MISSION_COMPLETED, {
      mission_id: missionId,
      mission_difficulty: difficulty,
    }),

  logAchievementUnlocked: (achievementId: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.ACHIEVEMENT_UNLOCKED, { achievement_id: achievementId }),

  // Store/Purchases
  logPackOpened: (packId: number, packType: string, cardsReceived: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.PACK_OPENED, {
      pack_id: packId,
      pack_type: packType,
      cards_received: cardsReceived,
    }),

  logPackPurchased: (packId: number, packType: string, price: number, currency: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.PACK_PURCHASED, {
      pack_id: packId,
      pack_type: packType,
      price,
      currency,
    }),

  logCardPurchased: (cardId: number, rarity: string, price: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.CARD_PURCHASED, { card_id: cardId, rarity, price }),

  logSeasonPassPurchased: (seasonId: number, price: number, currency: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.SEASON_PASS_PURCHASED, { season_id: seasonId, price, currency }),

  logPowerupPurchased: (powerupId: number, price: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.POWERUP_PURCHASED, { powerup_id: powerupId, price }),

  // Social/Referral
  logReferralCodeShared: (referralCode: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.REFERRAL_CODE_SHARED, { referral_code: referralCode }),

  logReferralCodeUsed: (referralCode: string, referrerAddress: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.REFERRAL_CODE_USED, {
      referral_code: referralCode,
      referrer_address: referrerAddress,
    }),

  // Tutorial
  logTutorialStarted: (tutorialId: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.TUTORIAL_STARTED, { tutorial_id: tutorialId }),

  logTutorialCompleted: (tutorialId: string, success: boolean) =>
    logAppsFlyerEvent(AppsFlyerEvents.TUTORIAL_COMPLETED, {
      tutorial_id: tutorialId,
      success: success ? 1 : 0,
    }),
};

// =============================================================================
// USER INVITE / REFERRAL LINK GENERATION
// =============================================================================

/**
 * Generate a referral invite URL using the AppsFlyer SDK
 * This creates a OneLink with proper attribution for tracking referrals
 *
 * On native platforms, uses AppsFlyer SDK to generate the link
 * On web, falls back to manual URL generation
 *
 * @param referralCode - The referral code (typically the username)
 * @param referrerAddress - The referrer's Starknet address
 * @param channel - Distribution channel (default: "mobile_share")
 * @param campaign - Campaign name (default: "referral")
 * @returns The generated referral URL or null if generation fails
 */
export async function generateNativeInviteUrl(
  referralCode: string,
  referrerAddress: string,
  channel: string = "mobile_share",
  campaign: string = "referral"
): Promise<string | null> {
  if (!isNative()) {
    console.log("[AppsFlyer] Web - using fallback link generation");
    return generateFallbackReferralLink(referralCode, referrerAddress);
  }

  try {
    console.log("[AppsFlyer] Generating native invite URL...", { referralCode, referrerAddress });
    const result = await AppsFlyerBridge.generateInviteUrl({
      referralCode,
      referrerAddress,
      channel,
      campaign,
    });

    console.log("[AppsFlyer] Invite URL generated:", result.url);
    return result.url || null;
  } catch (error) {
    console.error("[AppsFlyer] Failed to generate invite URL:", error);
    // Fall back to manual generation
    return generateFallbackReferralLink(referralCode, referrerAddress);
  }
}

/**
 * Fallback URL generation for web or when SDK fails
 * Creates a simple referral link that redirects through the website
 */
function generateFallbackReferralLink(referralCode: string, referrerAddress: string): string {
  const baseUrl = "https://jokersofneon.com";
  const params = new URLSearchParams({
    ref: referralCode,
    referrer: referrerAddress,
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Log an invite event when user shares their referral link
 * This helps track sharing behavior and measure referral program effectiveness
 *
 * @param referralCode - The referral code being shared
 * @param referrerAddress - The referrer's address
 * @param channel - Where the link was shared (e.g., "whatsapp", "twitter", "copy")
 */
export async function logReferralInvite(
  referralCode: string,
  referrerAddress: string,
  channel: string = "mobile_share"
): Promise<void> {
  // Log the event regardless of platform
  await logAppsFlyerEvent(AppsFlyerEvents.REFERRAL_CODE_SHARED, {
    referral_code: referralCode,
    referrer_address: referrerAddress,
    channel,
  });

  if (!isNative()) {
    console.log("[AppsFlyer] Web - logged referral share event");
    return;
  }

  try {
    await AppsFlyerBridge.logInvite({
      referralCode,
      referrerAddress,
      channel,
    });
    console.log("[AppsFlyer] Invite logged successfully");
  } catch (error) {
    console.error("[AppsFlyer] Failed to log invite:", error);
  }
}

/**
 * Combined function to generate a referral link and log the share event
 * Use this when the user initiates sharing their referral link
 *
 * @param referralCode - The referral code (username)
 * @param referrerAddress - The referrer's Starknet address
 * @param channel - Where the link will be shared
 * @returns The referral URL to share
 */
export async function createAndLogReferralLink(
  referralCode: string,
  referrerAddress: string,
  channel: string = "mobile_share"
): Promise<string | null> {
  // Generate the link
  const url = await generateNativeInviteUrl(referralCode, referrerAddress, channel);

  // Log the invite event
  if (url) {
    await logReferralInvite(referralCode, referrerAddress, channel);
  }

  return url;
}

// Re-export types for consumers
export type { GenerateInviteUrlOptions, LogInviteOptions };

// Re-export the bridge for referral listener
export { AppsFlyerBridge };
