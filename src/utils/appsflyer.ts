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
}

interface LogInviteOptions {
  channel?: string;
  referralCode: string;
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

// =============================================================================
// WEB IMPLEMENTATION (NO EXTERNAL SDK)
// =============================================================================
// AppsFlyer Web SDK (PBA) requires a separate Web Dev Key from the dashboard
// and is loaded via CDN script tag. For our use case, we handle web referrals
// directly without the external SDK - the native iOS/Android SDKs handle
// real attribution, and web just needs to capture ?ref= parameters.

const WEB_STORAGE_KEYS = {
  DEVICE_ID: "appsflyer_web_device_id",
  CUSTOMER_ID: "appsflyer_web_customer_id",
} as const;

/**
 * Generate a persistent device ID for web platform
 * Stored in localStorage to maintain consistency across sessions
 */
function getOrCreateWebDeviceId(): string {
  let deviceId = localStorage.getItem(WEB_STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    // Generate a UUID-like identifier
    deviceId = "web_" + crypto.randomUUID();
    localStorage.setItem(WEB_STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

// Web implementation for non-native platforms
// Handles referral tracking without external SDK dependency
class AppsFlyerBridgeWeb implements Partial<AppsFlyerBridgePlugin> {
  private listeners: Map<string, Set<(data: { data: string }) => void>> = new Map();

  async setCustomerUserId(options: { customerUserId: string }): Promise<void> {
    localStorage.setItem(WEB_STORAGE_KEYS.CUSTOMER_ID, options.customerUserId);
  }

  async logEvent(_options: { eventName: string; eventValues?: Record<string, unknown> }): Promise<void> {
    getOrCreateWebDeviceId();
  }

  async getAppsFlyerUID(): Promise<{ uid: string }> {
    // Web uses a generated persistent device ID
    const uid = getOrCreateWebDeviceId();
    return { uid };
  }

  async getDeviceId(): Promise<{ deviceId: string }> {
    const deviceId = getOrCreateWebDeviceId();
    return { deviceId };
  }

  async generateInviteUrl(options: GenerateInviteUrlOptions): Promise<{ url: string }> {
    // Generate OneLink URL with referral code
    const oneLinkBaseUrl = "https://jokersofneon.onelink.me/2BD9";
    const url = `${oneLinkBaseUrl}?ref=${encodeURIComponent(options.referralCode)}`;
    return { url };
  }

  async logInvite(options: LogInviteOptions): Promise<void> {
    // Log the invite event
    await this.logEvent({
      eventName: AppsFlyerEvents.REFERRAL_CODE_SHARED,
      eventValues: {
        referral_code: options.referralCode,
        channel: options.channel || "web_share",
      },
    });
  }

  async addListener(
    eventName: "conversionData" | "deepLink",
    listenerFunc: (data: { data: string }) => void
  ): Promise<{ remove: () => void }> {
    // Store listeners for web referral handling
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(listenerFunc);

    return {
      remove: () => {
        this.listeners.get(eventName)?.delete(listenerFunc);
      },
    };
  }

  // Method to emit events to listeners (used by web referral handling)
  emitEvent(eventName: "conversionData" | "deepLink", data: { data: string }): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(data));
    }
  }
}

// Create singleton instance for web
const webBridgeInstance = new AppsFlyerBridgeWeb();

const AppsFlyerBridge = registerPlugin<AppsFlyerBridgePlugin>("AppsFlyerBridge", {
  web: () => Promise.resolve(webBridgeInstance as AppsFlyerBridgePlugin),
});

// Export the web bridge instance for direct access (used by web referral handling)
export const getWebBridgeInstance = (): AppsFlyerBridgeWeb | null => {
  if (!Capacitor.isNativePlatform()) {
    return webBridgeInstance;
  }
  return null;
};

// =============================================================================
// CORE SDK FUNCTIONS
// =============================================================================

const isNative = () => Capacitor.isNativePlatform();

/**
 * Set Customer User ID (CUID) - links AppsFlyer data to your user
 * Call this when user logs in or creates account
 * Works on both native and web platforms
 */
export async function setAppsFlyerCustomerUserId(userAddress: string): Promise<void> {
  try {
    await AppsFlyerBridge.setCustomerUserId({ customerUserId: userAddress });
  } catch {
    // Silent fail - CUID is optional for analytics
  }
}

/**
 * Log a custom event to AppsFlyer
 * Works on both native (via SDK) and web (via Web SDK or local logging)
 */
export async function logAppsFlyerEvent(
  eventName: string,
  eventValues?: Record<string, unknown>
): Promise<void> {
  try {
    await AppsFlyerBridge.logEvent({ eventName, eventValues: eventValues ?? {} });
  } catch (error) {
    console.error(`[AppsFlyer] Event failed (${eventName}):`, error);
  }
}

/**
 * Get AppsFlyer UID - unique device identifier
 * On web, returns a generated persistent device ID
 */
export async function getAppsFlyerUID(): Promise<string | null> {
  try {
    const result = await AppsFlyerBridge.getAppsFlyerUID();
    return result.uid || null;
  } catch {
    return null;
  }
}

/**
 * Get Device ID (IDFV on iOS, Android ID on Android, generated UUID on web)
 */
export async function getDeviceId(): Promise<string | null> {
  try {
    const result = await AppsFlyerBridge.getDeviceId();
    return result.deviceId || null;
  } catch {
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
 * Creates a simple OneLink with just the referral code (username)
 *
 * On native platforms, uses AppsFlyer SDK to generate the link
 * On web, falls back to manual URL generation
 *
 * @param referralCode - The referral code (username)
 * @returns The generated referral URL or null if generation fails
 */
export async function generateNativeInviteUrl(referralCode: string): Promise<string | null> {
  if (!isNative()) {
    return generateFallbackReferralLink(referralCode, "");
  }

  try {
    const result = await AppsFlyerBridge.generateInviteUrl({ referralCode });
    if (result.url) {
      return result.url;
    }
    return generateFallbackReferralLink(referralCode, "");
  } catch {
    // Fallback to manual link generation
    return generateFallbackReferralLink(referralCode, "");
  }
}

/**
 * Fallback URL generation for web or when SDK fails
 * Creates an AppsFlyer OneLink with minimal referral parameter
 * This link will redirect to App Store if app not installed, or open the app with deep link
 *
 * The OneLink template should have default values configured for:
 * - deep_link_value = "ref"
 * - pid = "user_invite"
 * - c = "referral"
 */
function generateFallbackReferralLink(referralCode: string, _referrerAddress: string): string {
  const oneLinkBaseUrl = "https://jokersofneon.onelink.me/2BD9";
  return `${oneLinkBaseUrl}?ref=${encodeURIComponent(referralCode)}`;
}

/**
 * Log an invite event when user shares their referral link
 *
 * @param referralCode - The referral code being shared
 * @param channel - Where the link was shared (e.g., "whatsapp", "twitter", "copy")
 */
export async function logReferralInvite(
  referralCode: string,
  channel: string = "mobile_share"
): Promise<void> {
  // Log event (non-critical, silent fail)
  logAppsFlyerEvent(AppsFlyerEvents.REFERRAL_CODE_SHARED, {
    referral_code: referralCode,
    channel,
  }).catch(() => {});

  if (!isNative()) return;

  try {
    await AppsFlyerBridge.logInvite({ referralCode, channel });
  } catch {
    // Silent fail - analytics only
  }
}

/**
 * Combined function to generate a referral link and log the share event
 *
 * @param referralCode - The referral code (username)
 * @param channel - Where the link will be shared
 * @returns The referral URL to share
 */
export async function createAndLogReferralLink(
  referralCode: string,
  channel: string = "mobile_share"
): Promise<string | null> {
  const url = await generateNativeInviteUrl(referralCode);

  if (url) {
    await logReferralInvite(referralCode, channel);
  }

  return url;
}

// Re-export types for consumers
export type { GenerateInviteUrlOptions, LogInviteOptions };

// Re-export the bridge for referral listener
export { AppsFlyerBridge };
