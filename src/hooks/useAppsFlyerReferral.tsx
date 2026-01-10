import { useCallback, useEffect, useRef, useState } from "react";
import { useDojo } from "../dojo/DojoContext";
import { setAppsFlyerCustomerUserId } from "../utils/appsflyer";
import {
  AppsFlyerConversionData,
  AppsFlyerReferralData,
  clearPendingConversionData,
  clearPendingReferralData,
  getPendingConversionData,
  getPendingReferralData,
  isReferralAlreadyProcessed,
  processConversionData,
  processReferralData,
  registerMilestone,
} from "../utils/appsflyerReferral";

type ProcessingState = "idle" | "processing" | "success" | "error";

interface UseAppsFlyerReferralResult {
  referralData: AppsFlyerReferralData | null;
  conversionData: AppsFlyerConversionData | null;
  state: ProcessingState;
  retryReferral: () => Promise<void>;
  registerAccountCreatedMilestone: () => Promise<void>;
}

/**
 * Hook to handle AppsFlyer referral processing
 * Automatically processes pending referral/conversion data when user is logged in
 */
export function useAppsFlyerReferral(): UseAppsFlyerReferralResult {
  const {
    account: { account },
  } = useDojo();

  const [referralData, setReferralData] = useState<AppsFlyerReferralData | null>(null);
  const [conversionData, setConversionData] = useState<AppsFlyerConversionData | null>(null);
  const [state, setState] = useState<ProcessingState>("idle");

  // Use ref to track if we've already processed for this address
  const processedAddressRef = useRef<string | null>(null);

  // Process referral data
  const processReferral = useCallback(async (userAddress: string) => {
    console.log("[useAppsFlyerReferral] Checking for pending referral data...");
    const pending = getPendingReferralData();

    if (!pending) {
      console.log("[useAppsFlyerReferral] No pending referral data found");
      return;
    }

    console.log("[useAppsFlyerReferral] Found pending referral:", {
      type: pending.type,
      referralCode: pending.referralCode,
      referrerAddress: pending.referrerAddress,
      isDeferred: pending.isDeferred,
    });

    // Skip if already processed for this user
    if (isReferralAlreadyProcessed(userAddress)) {
      console.log("[useAppsFlyerReferral] Already processed for this user, clearing data");
      clearPendingReferralData();
      return;
    }

    console.log("[useAppsFlyerReferral] Processing referral for user:", userAddress);
    setState("processing");

    try {
      const success = await processReferralData(pending, userAddress);
      console.log("[useAppsFlyerReferral] Process result:", success);

      if (success) {
        setReferralData(pending);
        clearPendingReferralData();
        setState("success");

        // Auto-register account_created milestone for new referrals
        console.log("[useAppsFlyerReferral] Registering account_created milestone...");
        await registerMilestone(userAddress, "account_created");
        console.log("[useAppsFlyerReferral] Milestone registered successfully");
      } else {
        console.warn("[useAppsFlyerReferral] Processing failed, keeping data for retry");
        setReferralData(pending); // Keep for retry
        setState("error");
      }
    } catch (error) {
      console.error("[useAppsFlyerReferral] Process error:", error);
      setReferralData(pending);
      setState("error");
    }
  }, []);

  // Process conversion data
  const processConversion = useCallback(async (userAddress: string) => {
    console.log("[useAppsFlyerReferral] Checking for pending conversion data...");
    const pending = getPendingConversionData();

    if (!pending) {
      console.log("[useAppsFlyerReferral] No pending conversion data found");
      return;
    }

    console.log("[useAppsFlyerReferral] Found pending conversion:", {
      af_status: pending.af_status,
      media_source: pending.media_source,
      campaign: pending.campaign,
      is_first_launch: pending.is_first_launch,
    });

    try {
      const success = await processConversionData(pending, userAddress);
      console.log("[useAppsFlyerReferral] Conversion process result:", success);

      if (success) {
        setConversionData(pending);
        clearPendingConversionData();
        console.log("[useAppsFlyerReferral] Conversion data processed and cleared");
      }
    } catch (error) {
      console.error("[useAppsFlyerReferral] Conversion error:", error);
    }
  }, []);

  // Main effect - runs when user logs in
  useEffect(() => {
    const userAddress = account?.address;
    if (!userAddress) {
      console.log("[useAppsFlyerReferral] No user address, skipping processing");
      return;
    }

    // Skip if we already processed for this address
    if (processedAddressRef.current === userAddress) {
      console.log("[useAppsFlyerReferral] Already processed for address:", userAddress);
      return;
    }

    console.log("[useAppsFlyerReferral] New user address detected:", userAddress);
    processedAddressRef.current = userAddress;

    // Set customer user ID in AppsFlyer SDK
    console.log("[useAppsFlyerReferral] Setting AppsFlyer CUID...");
    setAppsFlyerCustomerUserId(userAddress);

    // Small delay to ensure everything is ready
    const timer = setTimeout(async () => {
      console.log("[useAppsFlyerReferral] Starting referral/conversion processing...");
      await processReferral(userAddress);
      await processConversion(userAddress);
      console.log("[useAppsFlyerReferral] Processing complete");
    }, 500);

    return () => clearTimeout(timer);
  }, [account?.address, processReferral, processConversion]);

  // Retry failed referral
  const retryReferral = useCallback(async () => {
    const userAddress = account?.address;
    if (!userAddress || !referralData) return;

    setState("processing");
    try {
      const success = await processReferralData(referralData, userAddress);
      if (success) {
        clearPendingReferralData();
        setState("success");
      } else {
        setState("error");
      }
    } catch (error) {
      console.error("[useAppsFlyerReferral] Retry failed:", error);
      setState("error");
    }
  }, [account?.address, referralData]);

  // Register account created milestone (call after profile creation)
  const registerAccountCreatedMilestone = useCallback(async () => {
    const userAddress = account?.address;
    if (!userAddress) return;

    await registerMilestone(userAddress, "account_created");
  }, [account?.address]);

  return {
    referralData,
    conversionData,
    state,
    retryReferral,
    registerAccountCreatedMilestone,
  };
}

// Keep the old export name for backwards compatibility
export { useAppsFlyerReferral as default };
