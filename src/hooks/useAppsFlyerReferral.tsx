import { useEffect, useState } from "react";
import { useDojo } from "../dojo/DojoContext";
import {
  getPendingReferralData,
  getPendingConversionData,
  processReferralData,
  processConversionData,
  clearPendingReferralData,
  clearPendingConversionData,
  AppsFlyerReferralData,
  AppsFlyerConversionData,
} from "../utils/appsflyerReferral";
import { setAppsFlyerCustomerUserId } from "../utils/appsflyer";

/**
 * Hook to handle AppsFlyer referral data
 * Processes referral links and install attribution when user is ready
 */
export const useAppsFlyerReferral = () => {
  const {
    account: { account },
  } = useDojo();
  const [referralData, setReferralData] = useState<AppsFlyerReferralData | null>(null);
  const [conversionData, setConversionData] = useState<AppsFlyerConversionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!account?.address) {
      return;
    }

    // Set customer user ID in AppsFlyer
    setAppsFlyerCustomerUserId(account.address).catch((err) => {
      console.warn("[AppsFlyer] Failed to set customer user ID:", err);
    });

    // Process pending referral data
    const processReferral = async () => {
      const pendingReferral = getPendingReferralData();
      if (pendingReferral && !isProcessing) {
        setIsProcessing(true);
        try {
          const success = await processReferralData(pendingReferral, account.address);
          if (success) {
            setReferralData(pendingReferral);
            clearPendingReferralData();
            console.log("[AppsFlyer] Referral processed successfully");
          } else {
            // Keep the data for retry later
            setReferralData(pendingReferral);
          }
        } catch (error) {
          console.error("[AppsFlyer] Error processing referral:", error);
          setReferralData(pendingReferral);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    // Process pending conversion data (install attribution)
    const processConversion = async () => {
      const pendingConversion = getPendingConversionData();
      if (pendingConversion && !isProcessing) {
        setIsProcessing(true);
        try {
          const success = await processConversionData(pendingConversion, account.address);
          if (success) {
            setConversionData(pendingConversion);
            clearPendingConversionData();
            console.log("[AppsFlyer] Conversion data processed successfully");
          }
        } catch (error) {
          console.error("[AppsFlyer] Error processing conversion:", error);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    // Small delay to ensure API is ready
    const timer = setTimeout(() => {
      processReferral();
      processConversion();
    }, 1000);

    return () => clearTimeout(timer);
  }, [account?.address, isProcessing]);

  return {
    referralData,
    conversionData,
    isProcessing,
    retryProcessing: async () => {
      if (referralData && account?.address) {
        setIsProcessing(true);
        try {
          const success = await processReferralData(referralData, account.address);
          if (success) {
            clearPendingReferralData();
            setReferralData(null);
          }
        } catch (error) {
          console.error("[AppsFlyer] Retry failed:", error);
        } finally {
          setIsProcessing(false);
        }
      }
    },
  };
};
