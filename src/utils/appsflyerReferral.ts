import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { registerPlugin } from "@capacitor/core";

/**
 * AppsFlyer Referral Data Types
 */
export interface AppsFlyerReferralData {
  type: "referral" | "deep_link";
  isDeferred: boolean;
  deepLinkValue: string;
  referralCode?: string;
  referrerAddress?: string;
  mediaSource?: string;
  campaign?: string;
  [key: string]: any; // For other deep link parameters
}

export interface AppsFlyerConversionData {
  af_status?: string;
  media_source?: string;
  campaign?: string;
  af_channel?: string;
  is_first_launch?: boolean;
  [key: string]: any;
}

/**
 * Store referral data temporarily until user is ready
 */
let pendingReferralData: AppsFlyerReferralData | null = null;
let pendingConversionData: AppsFlyerConversionData | null = null;
let referralListenerInitialized = false;

// AppsFlyer Bridge Plugin Interface
interface AppsFlyerBridgePlugin {
  addListener(
    eventName: 'conversionData' | 'deepLink',
    listenerFunc: (data: { data: string }) => void
  ): Promise<{ remove: () => void }>;
  setCustomerUserId(options: { customerUserId: string }): Promise<void>;
  logEvent(options: { eventName: string; eventValues?: Record<string, any> }): Promise<void>;
  getAppsFlyerUID(): Promise<{ uid: string }>;
}

// Register the plugin
const AppsFlyerBridge = registerPlugin<AppsFlyerBridgePlugin>('AppsFlyerBridge', {
  web: () => import('./appsflyerReferral.web').then(m => new m.AppsFlyerBridgeWeb()),
});

/**
 * Initialize AppsFlyer referral listener
 * This listens for deep link and conversion data from native iOS code
 */
export const initAppsFlyerReferralListener = async () => {
  if (referralListenerInitialized || !Capacitor.isNativePlatform()) {
    return;
  }

  referralListenerInitialized = true;

  try {
    // Listen for conversion data (install attribution)
    await AppsFlyerBridge.addListener('conversionData', (event) => {
      try {
        const data = JSON.parse(event.data) as AppsFlyerConversionData;
        pendingConversionData = data;
        console.log('[AppsFlyer] Conversion data received:', data);
        
        // Store in localStorage as backup
        localStorage.setItem('appsflyer_conversion_data', event.data);
      } catch (error) {
        console.error('[AppsFlyer] Error parsing conversion data:', error);
      }
    });

    // Listen for deep link data (referral links)
    await AppsFlyerBridge.addListener('deepLink', (event) => {
      try {
        const data = JSON.parse(event.data) as AppsFlyerReferralData;
        pendingReferralData = data;
        console.log('[AppsFlyer] Deep link data received:', data);
        
        // Store in localStorage as backup
        localStorage.setItem('appsflyer_referral_data', event.data);
      } catch (error) {
        console.error('[AppsFlyer] Error parsing deep link data:', error);
      }
    });
  } catch (error) {
    console.warn('[AppsFlyer] Bridge plugin not available, using localStorage fallback:', error);
    // Fallback to localStorage polling
    checkStoredReferralData();
  }

  // Also listen for app URL opens
  App.addListener("appUrlOpen", ({ url }) => {
    console.log("[AppsFlyer] App opened with URL:", url);
  });

  // Check for any stored data on init
  checkStoredReferralData();
};

/**
 * Check for stored referral data (set by native code via localStorage bridge)
 */
const checkStoredReferralData = () => {
  try {
    const stored = localStorage.getItem("appsflyer_referral_data");
    const storedConversion = localStorage.getItem("appsflyer_conversion_data");

    if (stored) {
      const data = JSON.parse(stored) as AppsFlyerReferralData;
      pendingReferralData = data;
      localStorage.removeItem("appsflyer_referral_data");
      console.log("[AppsFlyer] Found stored referral data:", data);
    }

    if (storedConversion) {
      const data = JSON.parse(storedConversion) as AppsFlyerConversionData;
      pendingConversionData = data;
      localStorage.removeItem("appsflyer_conversion_data");
      console.log("[AppsFlyer] Found stored conversion data:", data);
    }
  } catch (error) {
    console.error("[AppsFlyer] Error checking stored data:", error);
  }
};

/**
 * Get pending referral data (if app was opened via referral link)
 */
export const getPendingReferralData = (): AppsFlyerReferralData | null => {
  checkStoredReferralData();
  return pendingReferralData;
};

/**
 * Get pending conversion data (install attribution)
 */
export const getPendingConversionData = (): AppsFlyerConversionData | null => {
  checkStoredReferralData();
  return pendingConversionData;
};

/**
 * Clear pending referral data after processing
 */
export const clearPendingReferralData = () => {
  pendingReferralData = null;
  localStorage.removeItem("appsflyer_referral_data");
};

/**
 * Clear pending conversion data after processing
 */
export const clearPendingConversionData = () => {
  pendingConversionData = null;
  localStorage.removeItem("appsflyer_conversion_data");
};

/**
 * Process referral data - register with API
 */
export const processReferralData = async (
  referralData: AppsFlyerReferralData,
  currentUserAddress: string
): Promise<boolean> => {
  try {
    if (referralData.type !== "referral" || !referralData.referralCode) {
      console.log("[AppsFlyer] Not a valid referral link");
      return false;
    }

    // Call API to register referral
    const apiKey = import.meta.env.VITE_GAME_API_KEY;
    const baseUrl =
      import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
      "http://localhost:3001";

    const response = await fetch(`${baseUrl}/api/referral/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey || "",
      },
      body: JSON.stringify({
        referee_address: currentUserAddress,
        referral_code: referralData.referralCode,
        referrer_address: referralData.referrerAddress,
        is_deferred: referralData.isDeferred,
        media_source: referralData.mediaSource,
        campaign: referralData.campaign,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[AppsFlyer] Failed to register referral:", error);
      return false;
    }

    const result = await response.json();
    console.log("[AppsFlyer] Referral registered successfully:", result);
    return result.success === true;
  } catch (error) {
    console.error("[AppsFlyer] Error processing referral:", error);
    return false;
  }
};

/**
 * Process conversion data - register install attribution
 */
export const processConversionData = async (
  conversionData: AppsFlyerConversionData,
  currentUserAddress: string
): Promise<boolean> => {
  try {
    // Only process non-organic installs
    if (conversionData.af_status !== "Non-organic") {
      console.log("[AppsFlyer] Organic install, skipping attribution");
      return false;
    }

    const apiKey = import.meta.env.VITE_GAME_API_KEY;
    const baseUrl =
      import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
      "http://localhost:3001";

    const response = await fetch(`${baseUrl}/api/referral/attribution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey || "",
      },
      body: JSON.stringify({
        user_address: currentUserAddress,
        media_source: conversionData.media_source,
        campaign: conversionData.campaign,
        af_channel: conversionData.af_channel,
        is_first_launch: conversionData.is_first_launch === true,
        attribution_data: conversionData,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[AppsFlyer] Failed to register attribution:", error);
      return false;
    }

    const result = await response.json();
    console.log("[AppsFlyer] Attribution registered successfully:", result);
    return result.success === true;
  } catch (error) {
    console.error("[AppsFlyer] Error processing attribution:", error);
    return false;
  }
};
