import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { AppsFlyerBridge, getDeviceId, getWebBridgeInstance } from "./appsflyer";

// =============================================================================
// TYPES
// =============================================================================

export interface AppsFlyerReferralData {
  type: "referral" | "deep_link";
  isDeferred: boolean;
  deepLinkValue: string;
  referralCode?: string;
  referrerAddress?: string;
  mediaSource?: string;
  campaign?: string;
  [key: string]: unknown;
}

export interface AppsFlyerConversionData {
  af_status?: "Organic" | "Non-organic";
  media_source?: string;
  campaign?: string;
  af_channel?: string;
  is_first_launch?: boolean;
  [key: string]: unknown;
}

// =============================================================================
// STATE
// =============================================================================

const STORAGE_KEYS = {
  REFERRAL: "appsflyer_referral_data",
  CONVERSION: "appsflyer_conversion_data",
  PROCESSED: "appsflyer_referral_processed",
  WEB_REFERRAL: "pending_web_referral",
} as const;

let pendingReferralData: AppsFlyerReferralData | null = null;
let pendingConversionData: AppsFlyerConversionData | null = null;
let listenerInitialized = false;

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize AppsFlyer referral listeners
 * Call this once at app startup (in App.tsx or main.tsx)
 */
export async function initAppsFlyerReferralListener(): Promise<void> {
  if (listenerInitialized || !Capacitor.isNativePlatform()) {
    return;
  }

  listenerInitialized = true;

  try {
    // Listen for conversion data (install attribution)
    await AppsFlyerBridge.addListener("conversionData", (event) => {
      try {
        const data = JSON.parse(event.data) as AppsFlyerConversionData;
        pendingConversionData = data;
        localStorage.setItem(STORAGE_KEYS.CONVERSION, event.data);
      } catch (error) {
        console.error("[AppsFlyer Referral] Failed to parse conversion data:", error);
      }
    });

    // Listen for deep link data (referral links)
    await AppsFlyerBridge.addListener("deepLink", (event) => {
      try {
        const data = JSON.parse(event.data) as AppsFlyerReferralData;
        pendingReferralData = data;
        localStorage.setItem(STORAGE_KEYS.REFERRAL, event.data);
      } catch (error) {
        console.error("[AppsFlyer Referral] Failed to parse deep link:", error);
      }
    });

    // Check for stored data from previous sessions
    loadStoredData();

  } catch (error) {
    console.warn("[AppsFlyer Referral] Failed to initialize listeners:", error);
    loadStoredData();
  }
}

// =============================================================================
// DATA ACCESS
// =============================================================================

function loadStoredData(): void {
  try {
    const storedReferral = localStorage.getItem(STORAGE_KEYS.REFERRAL);
    if (storedReferral && !pendingReferralData) {
      pendingReferralData = JSON.parse(storedReferral);
    }

    const storedConversion = localStorage.getItem(STORAGE_KEYS.CONVERSION);
    if (storedConversion && !pendingConversionData) {
      pendingConversionData = JSON.parse(storedConversion);
    }
  } catch (error) {
    console.error("[AppsFlyer Referral] Failed to load stored data:", error);
  }
}

export function getPendingReferralData(): AppsFlyerReferralData | null {
  loadStoredData();
  return pendingReferralData;
}

export function getPendingConversionData(): AppsFlyerConversionData | null {
  loadStoredData();
  return pendingConversionData;
}

export function clearPendingReferralData(): void {
  pendingReferralData = null;
  localStorage.removeItem(STORAGE_KEYS.REFERRAL);
}

export function clearPendingConversionData(): void {
  pendingConversionData = null;
  localStorage.removeItem(STORAGE_KEYS.CONVERSION);
}

export function isReferralAlreadyProcessed(userAddress: string): boolean {
  const processed = localStorage.getItem(STORAGE_KEYS.PROCESSED);
  if (!processed) return false;
  try {
    const addresses: string[] = JSON.parse(processed);
    return addresses.includes(userAddress.toLowerCase());
  } catch {
    return false;
  }
}

function markReferralAsProcessed(userAddress: string): void {
  try {
    const processed = localStorage.getItem(STORAGE_KEYS.PROCESSED);
    const addresses: string[] = processed ? JSON.parse(processed) : [];
    if (!addresses.includes(userAddress.toLowerCase())) {
      addresses.push(userAddress.toLowerCase());
      localStorage.setItem(STORAGE_KEYS.PROCESSED, JSON.stringify(addresses));
    }
  } catch {
    localStorage.setItem(STORAGE_KEYS.PROCESSED, JSON.stringify([userAddress.toLowerCase()]));
  }
}

// =============================================================================
// API CALLS
// =============================================================================

function getApiConfig() {
  const apiKey = import.meta.env.VITE_GAME_API_KEY || "";
  const baseUrl = (import.meta.env.VITE_GAME_API_URL || "http://localhost:3001").replace(/\/$/, "");
  return { apiKey, baseUrl };
}

/**
 * Process referral data - claim the referral code with the API
 * @param accountType - The type of account (burner, controller, or null)
 * @param username - The user's username (for guest detection)
 */
export async function processReferralData(
  referralData: AppsFlyerReferralData,
  userAddress: string,
  accountType?: "burner" | "controller" | null,
  username?: string | null
): Promise<boolean> {
  // Validate referral data
  if (referralData.type !== "referral" || !referralData.referralCode) {
    return false;
  }

  // Skip if already processed
  if (isReferralAlreadyProcessed(userAddress)) {
    clearPendingReferralData();
    return true;
  }

  const { apiKey, baseUrl } = getApiConfig();
  const deviceId = await getDeviceId();

  try {
    const response = await fetch(`${baseUrl}/api/referral/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        referee_address: userAddress,
        referral_code: referralData.referralCode,
        referrer_address: referralData.referrerAddress,
        is_deferred: referralData.isDeferred,
        media_source: referralData.mediaSource,
        campaign: referralData.campaign,
        device_id: deviceId,
        account_type: accountType,
        username: username,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[AppsFlyer Referral] Claim failed:", response.status, errorText);
      return false;
    }

    const result = await response.json();

    if (result.success || result.already_claimed) {
      markReferralAsProcessed(userAddress);
      return true;
    }

    return false;
  } catch (error) {
    console.error("[AppsFlyer Referral] Claim error:", error);
    return false;
  }
}

/**
 * Process conversion data - register install attribution
 */
export async function processConversionData(
  conversionData: AppsFlyerConversionData,
  userAddress: string
): Promise<boolean> {
  // Only process non-organic installs
  if (conversionData.af_status !== "Non-organic") {
    return true; // Return true to clear the data
  }

  const { apiKey, baseUrl } = getApiConfig();

  try {
    const response = await fetch(`${baseUrl}/api/referral/attribution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        user_address: userAddress,
        media_source: conversionData.media_source,
        campaign: conversionData.campaign,
        af_channel: conversionData.af_channel,
        is_first_launch: conversionData.is_first_launch === true,
        attribution_data: conversionData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[AppsFlyer Referral] Attribution failed:", response.status, errorText);
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("[AppsFlyer Referral] Attribution error:", error);
    return false;
  }
}

/**
 * Register a milestone achieved by this user
 * Call this when user reaches milestones (games played, levels, etc.)
 * @param milestoneValue Optional numeric value (e.g., actual level, purchase amount in cents)
 * @param accountType Optional account type for backend validation
 * @param username Optional username for backend validation
 */
export async function registerMilestone(
  userAddress: string,
  milestoneType:
    | "account_created"
    | "games_played_5"
    | "games_played_10"
    | "level_5"
    | "level_10"
    | "first_purchase"
    | "daily_mission_completed"
    | "season_pass_purchased"
    | "pack_purchased",
  milestoneValue?: number,
  accountType?: "burner" | "controller" | null,
  username?: string | null
): Promise<boolean> {
  const { apiKey, baseUrl } = getApiConfig();

  try {
    const response = await fetch(`${baseUrl}/api/referral/milestone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        user_address: userAddress,
        milestone_type: milestoneType,
        milestone_value: milestoneValue,
        account_type: accountType,
        username: username,
      }),
    });

    if (!response.ok) {
      console.error("[AppsFlyer Referral] Milestone registration failed:", response.status);
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("[AppsFlyer Referral] Milestone error:", error);
    return false;
  }
}

// =============================================================================
// WEB REFERRAL HANDLING
// =============================================================================

/**
 * Check URL for referral parameter and store for later processing
 * Call this on app initialization (before auth)
 *
 * @returns The referral code if found, null otherwise
 */
export function detectWebReferral(): string | null {
  // Only run on web platform
  if (Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get("ref");

    if (referralCode && referralCode.trim()) {
      const trimmedCode = referralCode.trim();

      // Store for later processing after login
      const webReferral: AppsFlyerReferralData = {
        type: "referral",
        isDeferred: false,
        deepLinkValue: "ref",
        referralCode: trimmedCode,
        mediaSource: "web_referral",
        campaign: urlParams.get("c") || urlParams.get("campaign") || undefined,
      };

      localStorage.setItem(STORAGE_KEYS.WEB_REFERRAL, JSON.stringify(webReferral));

      // Also set as pending referral data for unified processing
      pendingReferralData = webReferral;
      localStorage.setItem(STORAGE_KEYS.REFERRAL, JSON.stringify(webReferral));

      // Optionally clean the URL (remove ref param)
      cleanReferralFromUrl();

      return trimmedCode;
    }
  } catch (error) {
    console.error("[AppsFlyer Referral] Error detecting web referral:", error);
  }

  return null;
}

/**
 * Get pending web referral if any
 */
export function getPendingWebReferral(): AppsFlyerReferralData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WEB_REFERRAL);
    if (stored) {
      return JSON.parse(stored) as AppsFlyerReferralData;
    }
  } catch (error) {
    console.error("[AppsFlyer Referral] Error getting pending web referral:", error);
  }
  return null;
}

/**
 * Clear pending web referral
 */
export function clearPendingWebReferral(): void {
  localStorage.removeItem(STORAGE_KEYS.WEB_REFERRAL);
}

/**
 * Process web referral on login
 * Call this after user successfully logs in on web platform
 *
 * @param userAddress - The logged-in user's address
 * @returns true if referral was processed successfully
 */
export async function processWebReferral(userAddress: string): Promise<boolean> {
  // Check for pending web referral
  const webReferral = getPendingWebReferral();

  // Also check the general pending referral data (unified approach)
  const referralData = webReferral || getPendingReferralData();

  if (!referralData) {
    return false;
  }

  // Skip if already processed for this user
  if (isReferralAlreadyProcessed(userAddress)) {
    clearPendingWebReferral();
    clearPendingReferralData();
    return true;
  }

  // Process using the same logic as native
  const success = await processReferralData(referralData, userAddress);

  if (success) {
    clearPendingWebReferral();
    clearPendingReferralData();

    // Also register attribution for web
    await registerWebAttribution(userAddress, referralData);
  }

  return success;
}

/**
 * Register web attribution data
 */
async function registerWebAttribution(
  userAddress: string,
  referralData: AppsFlyerReferralData
): Promise<void> {
  const { apiKey, baseUrl } = getApiConfig();
  const deviceId = await getDeviceId();

  try {
    await fetch(`${baseUrl}/api/referral/attribution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        user_address: userAddress,
        device_id: deviceId,
        media_source: referralData.mediaSource || "web_referral",
        campaign: referralData.campaign,
        af_status: "Non-organic",
        is_first_launch: true,
        platform: "web",
        attribution_data: referralData,
      }),
    });
  } catch (error) {
    console.error("[AppsFlyer Referral] Web attribution error:", error);
  }
}

/**
 * Remove ref parameter from URL without page reload
 * Keeps the URL clean after capturing the referral
 */
function cleanReferralFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete("ref");
    url.searchParams.delete("c");
    url.searchParams.delete("campaign");

    // Only update if we removed parameters
    if (url.href !== window.location.href) {
      window.history.replaceState({}, document.title, url.href);
    }
  } catch (error) {
    // Ignore errors (e.g., in non-browser environments)
  }
}

/**
 * Initialize web referral detection
 * Call this early in app initialization
 */
export function initWebReferralDetection(): void {
  if (Capacitor.isNativePlatform()) {
    return;
  }

  detectWebReferral();
}
