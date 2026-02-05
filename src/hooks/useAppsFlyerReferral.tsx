import { useCallback, useEffect, useRef, useState } from "react";
import { useDojo } from "../dojo/DojoContext";
import { useUsername } from "../dojo/utils/useUsername";
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
    setup: { accountType },
  } = useDojo();
  const username = useUsername();

  const [referralData, setReferralData] = useState<AppsFlyerReferralData | null>(null);
  const [conversionData, setConversionData] = useState<AppsFlyerConversionData | null>(null);
  const [state, setState] = useState<ProcessingState>("idle");

  // Use ref to track if we've already processed for this address
  const processedAddressRef = useRef<string | null>(null);

  // Process referral data
  const processReferral = useCallback(async (
    userAddress: string,
    accType: "burner" | "controller" | null,
    user: string | null | undefined
  ) => {
    console.log("[useAppsFlyerReferral] processReferral called", { userAddress, accType, user });

    const pending = getPendingReferralData();
    console.log("[useAppsFlyerReferral] Pending referral data:", pending);

    if (!pending) {
      console.log("[useAppsFlyerReferral] No pending referral data, skipping");
      return;
    }

    // Skip if already processed for this user
    if (isReferralAlreadyProcessed(userAddress)) {
      console.log("[useAppsFlyerReferral] Already processed for this user, skipping");
      clearPendingReferralData();
      return;
    }
    setState("processing");

    try {
      console.log("[useAppsFlyerReferral] Calling processReferralData...");
      const result = await processReferralData(pending, userAddress, accType, user);
      console.log("[useAppsFlyerReferral] processReferralData result:", result);

      if (result.success) {
        setReferralData(pending);
        clearPendingReferralData();
        setState("success");

        // Only register milestone if claim was NOT ignored (i.e., not a burner/guest)
        if (!result.ignored) {
          console.log("[useAppsFlyerReferral] Registering account_created milestone...");
          try {
            await registerMilestone(userAddress, "account_created", undefined, accType, user);
            console.log("[useAppsFlyerReferral] account_created milestone registered successfully");
          } catch (milestoneError) {
            console.error("[useAppsFlyerReferral] Error registering account_created milestone:", milestoneError);
          }
        } else {
          console.log("[useAppsFlyerReferral] Claim was ignored (burner/guest), skipping milestone registration");
        }
      } else {
        console.log("[useAppsFlyerReferral] processReferralData returned false");
        setReferralData(pending); // Keep for retry
        setState("error");
      }
    } catch (error) {
      console.error("[useAppsFlyerReferral] Error in processReferral:", error);
      setReferralData(pending);
      setState("error");
    }
  }, []);

  // Process conversion data
  const processConversion = useCallback(async (userAddress: string) => {
    const pending = getPendingConversionData();

    if (!pending) {
      return;
    }

    try {
      const success = await processConversionData(pending, userAddress);

      if (success) {
        setConversionData(pending);
        clearPendingConversionData();
      }
    } catch (error) {
      console.error("[useAppsFlyerReferral] Conversion error:", error);
    }
  }, []);

  // Main effect - runs when user logs in
  useEffect(() => {
    const userAddress = account?.address;
    if (!userAddress) {
      return;
    }

    // Skip if we already processed for this address
    if (processedAddressRef.current === userAddress) {
      return;
    }

    processedAddressRef.current = userAddress;

    // Set customer user ID in AppsFlyer SDK
    setAppsFlyerCustomerUserId(userAddress);

    // Small delay to ensure everything is ready
    const timer = setTimeout(async () => {
      await processReferral(userAddress, accountType, username);
      await processConversion(userAddress);
    }, 500);

    return () => clearTimeout(timer);
  }, [account?.address, accountType, username, processReferral, processConversion]);

  // Retry failed referral
  const retryReferral = useCallback(async () => {
    const userAddress = account?.address;
    if (!userAddress || !referralData) return;

    setState("processing");
    try {
      const result = await processReferralData(referralData, userAddress, accountType, username);
      if (result.success) {
        clearPendingReferralData();
        setState("success");
      } else {
        setState("error");
      }
    } catch (error) {
      setState("error");
    }
  }, [account?.address, accountType, username, referralData]);

  // Register account created milestone (call after profile creation)
  const registerAccountCreatedMilestone = useCallback(async () => {
    const userAddress = account?.address;
    if (!userAddress) return;

    await registerMilestone(userAddress, "account_created", undefined, accountType, username);
  }, [account?.address, accountType, username]);

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
