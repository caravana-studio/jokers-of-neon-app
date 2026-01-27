import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDojo } from "../dojo/DojoContext";
import { useSeasonProgressStore } from "../state/useSeasonProgressStore";
import { showPurchaseSuccessToast } from "../utils/transactionNotifications";
import { useRevenueCat } from "./RevenueCatProvider";

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
  const {
    account: { account },
  } = useDojo();
  const userAddress = account?.address;
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
    } catch (error) {
      console.error("Failed to purchase season pass", error);
      throw error;
    } finally {
      setIsPurchasing(false);
    }
  }, [purchasePackageById, refetchSeasonProgress, seasonPassId, userAddress]);

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
