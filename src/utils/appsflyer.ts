import { Capacitor } from "@capacitor/core";
import { Plugin } from "@capacitor/core";

// AppsFlyer event names for Jokers of Neon
export const AppsFlyerEvents = {
  // Account events
  ACCOUNT_CREATED: "jn_account_created",
  LOGIN: "jn_login",
  
  // Game events
  GAME_STARTED: "jn_game_started",
  GAME_COMPLETED: "jn_game_completed",
  GAME_WON: "jn_game_won",
  GAME_LOST: "jn_game_lost",
  LEVEL_ACHIEVED: "jn_level_achieved",
  ROUND_COMPLETED: "jn_round_completed",
  
  // Progression events
  PROFILE_LEVEL_UP: "jn_profile_level_up",
  DAILY_MISSION_COMPLETED: "jn_daily_mission_completed",
  ACHIEVEMENT_UNLOCKED: "jn_achievement_unlocked",
  
  // Store events
  PACK_OPENED: "jn_pack_opened",
  PACK_PURCHASED: "jn_pack_purchased",
  CARD_PURCHASED: "jn_card_purchased",
  SEASON_PASS_PURCHASED: "jn_season_pass_purchased",
  POWERUP_PURCHASED: "jn_powerup_purchased",
  
  // Social events
  REFERRAL_CODE_SHARED: "jn_referral_code_shared",
  REFERRAL_CODE_USED: "jn_referral_code_used",
  
  // Tutorial events
  TUTORIAL_STARTED: "jn_tutorial_started",
  TUTORIAL_COMPLETED: "jn_tutorial_completed",
} as const;

interface AppsFlyerPlugin {
  setCustomerUserId(options: { customerUserId: string }): Promise<void>;
  logEvent(options: { eventName: string; eventValues?: Record<string, any> }): Promise<void>;
  generateInviteLink(options: { userAddress: string }): Promise<{ inviteLink?: string; deepLinkValue?: string; conversionData?: any }>;
  getAppsFlyerUID(): Promise<{ uid: string }>;
}

// Get the plugin instance
const getAppsFlyerPlugin = async (): Promise<AppsFlyerPlugin | null> => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  
  try {
    // @ts-ignore - Plugin may not be registered yet
    const { AppsFlyerPlugin } = await import("@capacitor/core");
    return AppsFlyerPlugin as AppsFlyerPlugin;
  } catch (error) {
    console.warn("[AppsFlyer] Plugin not available:", error);
    return null;
  }
};

/**
 * Set customer user ID (CUID) for AppsFlyer
 * This should be called when user logs in or creates account
 */
export const setAppsFlyerCustomerUserId = async (userAddress: string): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log("[AppsFlyer] Web platform - skipping setCustomerUserId");
    return;
  }
  
  try {
    const plugin = await getAppsFlyerPlugin();
    if (plugin) {
      await plugin.setCustomerUserId({ customerUserId: userAddress });
      console.log("[AppsFlyer] Customer User ID set:", userAddress);
    } else {
      console.warn("[AppsFlyer] Plugin not available");
    }
  } catch (error) {
    console.error("[AppsFlyer] Error setting customer user ID:", error);
  }
};

/**
 * Log a custom event to AppsFlyer
 */
export const logAppsFlyerEvent = async (
  eventName: string,
  eventValues?: Record<string, any>
): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log(`[AppsFlyer] Web platform - would log event: ${eventName}`, eventValues);
    return;
  }
  
  try {
    const plugin = await getAppsFlyerPlugin();
    if (plugin) {
      await plugin.logEvent({
        eventName,
        eventValues: eventValues || {},
      });
      console.log(`[AppsFlyer] Event logged: ${eventName}`, eventValues);
    } else {
      console.warn("[AppsFlyer] Plugin not available");
    }
  } catch (error) {
    console.error(`[AppsFlyer] Error logging event ${eventName}:`, error);
  }
};

/**
 * Generate an invite link for referrals
 */
export const generateAppsFlyerInviteLink = async (
  userAddress: string
): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    console.log("[AppsFlyer] Web platform - cannot generate invite link");
    return null;
  }
  
  try {
    const plugin = await getAppsFlyerPlugin();
    if (plugin) {
      const result = await plugin.generateInviteLink({ userAddress });
      return result.inviteLink || null;
    } else {
      console.warn("[AppsFlyer] Plugin not available");
      return null;
    }
  } catch (error) {
    console.error("[AppsFlyer] Error generating invite link:", error);
    return null;
  }
};

/**
 * Get AppsFlyer UID
 */
export const getAppsFlyerUID = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  
  try {
    const plugin = await getAppsFlyerPlugin();
    if (plugin) {
      const result = await plugin.getAppsFlyerUID();
      return result.uid || null;
    } else {
      console.warn("[AppsFlyer] Plugin not available");
      return null;
    }
  } catch (error) {
    console.error("[AppsFlyer] Error getting UID:", error);
    return null;
  }
};

/**
 * Helper functions for common events
 */
export const AppsFlyerHelpers = {
  // Account events
  logAccountCreated: (userAddress: string, username: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.ACCOUNT_CREATED, {
      user_address: userAddress,
      username: username,
    }),

  logLogin: (userAddress: string, loginMethod: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.LOGIN, {
      user_address: userAddress,
      login_method: loginMethod,
    }),

  // Game events
  logGameStarted: (gameId: number, gameMode: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.GAME_STARTED, {
      game_id: gameId,
      game_mode: gameMode,
    }),

  logGameCompleted: (gameId: number, score: number, level: number, won: boolean) =>
    logAppsFlyerEvent(AppsFlyerEvents.GAME_COMPLETED, {
      game_id: gameId,
      score: score,
      level: level,
      won: won ? 1 : 0,
    }),

  logGameWon: (gameId: number, score: number, level: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.GAME_WON, {
      game_id: gameId,
      score: score,
      level: level,
    }),

  logGameLost: (gameId: number, score: number, level: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.GAME_LOST, {
      game_id: gameId,
      score: score,
      level: level,
    }),

  logLevelAchieved: (level: number, score: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.LEVEL_ACHIEVED, {
      level: level,
      score: score,
    }),

  logRoundCompleted: (round: number, score: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.ROUND_COMPLETED, {
      round: round,
      score: score,
    }),

  // Progression events
  logProfileLevelUp: (level: number, totalXp: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.PROFILE_LEVEL_UP, {
      level: level,
      total_xp: totalXp,
    }),

  logDailyMissionCompleted: (missionId: string, missionDifficulty: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.DAILY_MISSION_COMPLETED, {
      mission_id: missionId,
      mission_difficulty: missionDifficulty,
    }),

  logAchievementUnlocked: (achievementId: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.ACHIEVEMENT_UNLOCKED, {
      achievement_id: achievementId,
    }),

  // Store events
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
      price: price,
      currency: currency,
    }),

  logCardPurchased: (cardId: number, rarity: string, price: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.CARD_PURCHASED, {
      card_id: cardId,
      rarity: rarity,
      price: price,
    }),

  logSeasonPassPurchased: (seasonId: number, price: number, currency: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.SEASON_PASS_PURCHASED, {
      season_id: seasonId,
      price: price,
      currency: currency,
    }),

  logPowerupPurchased: (powerupId: number, price: number) =>
    logAppsFlyerEvent(AppsFlyerEvents.POWERUP_PURCHASED, {
      powerup_id: powerupId,
      price: price,
    }),

  // Social events
  logReferralCodeShared: (referralCode: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.REFERRAL_CODE_SHARED, {
      referral_code: referralCode,
    }),

  logReferralCodeUsed: (referralCode: string, referrerAddress: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.REFERRAL_CODE_USED, {
      referral_code: referralCode,
      referrer_address: referrerAddress,
    }),

  // Tutorial events
  logTutorialStarted: (tutorialId: string) =>
    logAppsFlyerEvent(AppsFlyerEvents.TUTORIAL_STARTED, {
      tutorial_id: tutorialId,
    }),

  logTutorialCompleted: (tutorialId: string, success: boolean) =>
    logAppsFlyerEvent(AppsFlyerEvents.TUTORIAL_COMPLETED, {
      tutorial_id: tutorialId,
      success: success ? 1 : 0,
    }),
};
