import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAccount } from "@starknet-react/core";
import { DojoContext } from "../dojo/DojoContext";
import { useSeasonProgressStore } from "../state/useSeasonProgressStore";
import { showPurchaseSuccessToast } from "../utils/transactionNotifications";
import { useRevenueCat } from "./RevenueCatProvider";
import { registerMilestone } from "../utils/appsflyerReferral";

const FIRST_PURCHASE_KEY = "referral_first_purchase_tracked";

type SeasonPassContextValue = {
  seasonPassUnlocked: boolean;
  loading: boolean;
  refetchSeasonPassUnlocked: () => Promise<void>;
  purchaseSeasonPass: () => Promise<void>;
};

const SeasonPassContext = createContext<SeasonPassContextValue>({
  seasonPassUnlocked: false,
  loading: false,
  refetchSeasonPassUnlocked: async () => {},
  purchaseSeasonPass: async () => {},
});

export const SeasonPassProvider = ({ children }: PropsWithChildren) => {
  const dojoCtx = useContext(DojoContext);
  const { address: starknetAddress } = useAccount();
  // Use || (not ??) so empty-string address ("" from shopFallbackAccount) is treated as null
  const dojoAddress = dojoCtx?.account?.account?.address || null;
  const accountType = dojoCtx?.accountType ?? null;
  const username = null;
  // Fall back to starknetAddress so marketplace connector login works
  // (dojoAddress stays null after marketplace login since DojoProvider isn't updated)
  const userAddress = dojoAddress || starknetAddress || null;
  const { offerings, purchasePackageById } = useRevenueCat();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const seasonPassUnlocked = useSeasonProgressStore(
    (store) => store.seasonPassUnlocked
  );
  const seasonProgressLoading = useSeasonProgressStore(
    (store) => store.loading
  );
  const lastUserAddress = useSeasonProgressStore(
    (store) => store.lastUserAddress
  );
  const refetchSeasonProgress = useSeasonProgressStore(
    (store) => store.refetch
  );
  const resetSeasonProgress = useSeasonProgressStore((store) => store.reset);

  // Track if first purchase milestone has been registered
  const hasTrackedFirstPurchaseRef = useRef(false);

  useEffect(() => {
    if (!userAddress) {
      if (lastUserAddress) {
        resetSeasonProgress();
      }
      return;
    }

    if (lastUserAddress !== userAddress) {
      void refetchSeasonProgress({ userAddress });
    }
  }, [lastUserAddress, refetchSeasonProgress, resetSeasonProgress, userAddress]);

  const seasonPassId = offerings?.seasonPass?.id;

  const purchaseSeasonPass = useCallback(async () => {
    if (!userAddress) {
      console.warn("purchaseSeasonPass: missing user address");
      return;
    }

    const seasonPassPackageId = seasonPassId;
    if (!seasonPassPackageId) {
      console.warn(
        "purchaseSeasonPass: missing RevenueCat season pass package"
      );
      return;
    }

    setIsPurchasing(true);
    try {
      await purchasePackageById(seasonPassPackageId);
      await refetchSeasonProgress({
        userAddress,
        forceSeasonPassUnlocked: true,
      });
      showPurchaseSuccessToast("season-pass");

      // Register season pass purchase milestone
      registerMilestone(userAddress, "season_pass_purchased", undefined, accountType, username)
        .catch((e) => console.error("Error registering season pass milestone", e));

      // Track first purchase milestone (only once per user)
      const hasTrackedFirstPurchase = localStorage.getItem(FIRST_PURCHASE_KEY);
      if (!hasTrackedFirstPurchase && !hasTrackedFirstPurchaseRef.current) {
        hasTrackedFirstPurchaseRef.current = true;
        localStorage.setItem(FIRST_PURCHASE_KEY, "true");
        registerMilestone(userAddress, "first_purchase", undefined, accountType, username)
          .catch((e) => console.error("Error registering first purchase milestone", e));
      }
    } catch (error) {
      console.error("Failed to purchase season pass", error);
      throw error;
    } finally {
      setIsPurchasing(false);
    }
  }, [purchasePackageById, refetchSeasonProgress, seasonPassId, userAddress, accountType, username]);

  const refetchSeasonPassUnlocked = useCallback(async () => {
    if (!userAddress) {
      resetSeasonProgress();
      return;
    }

    await refetchSeasonProgress({ userAddress });
  }, [refetchSeasonProgress, resetSeasonProgress, userAddress]);

  const loading = seasonProgressLoading || isPurchasing;

  const value = useMemo(
    () => ({
      seasonPassUnlocked,
      loading,
      refetchSeasonPassUnlocked,
      purchaseSeasonPass,
    }),
    [seasonPassUnlocked, loading, refetchSeasonPassUnlocked, purchaseSeasonPass]
  );

  return (
    <SeasonPassContext.Provider value={value}>
      {children}
    </SeasonPassContext.Provider>
  );
};

export const useSeasonPass = () => useContext(SeasonPassContext);
