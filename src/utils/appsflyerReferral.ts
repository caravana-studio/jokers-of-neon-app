import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { AppsFlyerBridge, getDeviceId } from "./appsflyer";

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
  console.log("[AppsFlyer Referral] Initializing listeners...");

  try {
    // Listen for conversion data (install attribution)
    await AppsFlyerBridge.addListener("conversionData", (event) => {
      try {
        const data = JSON.parse(event.data) as AppsFlyerConversionData;
        pendingConversionData = data;
        localStorage.setItem(STORAGE_KEYS.CONVERSION, event.data);
        console.log("[AppsFlyer Referral] Conversion data received:", data.af_status);
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
        console.log("[AppsFlyer Referral] Deep link received:", data.type, data.referralCode);
      } catch (error) {
        console.error("[AppsFlyer Referral] Failed to parse deep link:", error);
      }
    });

    // Check for stored data from previous sessions
    loadStoredData();

    // Listen for app URL opens (universal links)
    App.addListener("appUrlOpen", ({ url }) => {
      console.log("[AppsFlyer Referral] App opened with URL:", url);
    });

    console.log("[AppsFlyer Referral] Listeners initialized");
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
      console.log("[AppsFlyer Referral] Loaded stored referral data");
    }

    const storedConversion = localStorage.getItem(STORAGE_KEYS.CONVERSION);
    if (storedConversion && !pendingConversionData) {
      pendingConversionData = JSON.parse(storedConversion);
      console.log("[AppsFlyer Referral] Loaded stored conversion data");
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
 */
export async function processReferralData(
  referralData: AppsFlyerReferralData,
  userAddress: string
): Promise<boolean> {
  // Validate referral data
  if (referralData.type !== "referral" || !referralData.referralCode) {
    console.log("[AppsFlyer Referral] Not a valid referral link");
    return false;
  }

  // Skip if already processed
  if (isReferralAlreadyProcessed(userAddress)) {
    console.log("[AppsFlyer Referral] Already processed for this user");
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[AppsFlyer Referral] Claim failed:", response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log("[AppsFlyer Referral] Claim result:", result);

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
    console.log("[AppsFlyer Referral] Organic install, skipping attribution");
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
    console.log("[AppsFlyer Referral] Attribution result:", result);
    return result.success === true;
  } catch (error) {
    console.error("[AppsFlyer Referral] Attribution error:", error);
    return false;
  }
}

/**
 * Register a milestone achieved by this user
 * Call this when user reaches milestones (games played, levels, etc.)
 */
export async function registerMilestone(
  userAddress: string,
  milestoneType: "account_created" | "games_played_5" | "games_played_10" | "level_5" | "level_10",
  milestoneValue?: number
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
      }),
    });

    if (!response.ok) {
      console.error("[AppsFlyer Referral] Milestone registration failed:", response.status);
      return false;
    }

    const result = await response.json();
    console.log("[AppsFlyer Referral] Milestone registered:", milestoneType, result);
    return result.success === true;
  } catch (error) {
    console.error("[AppsFlyer Referral] Milestone error:", error);
    return false;
  }
}
