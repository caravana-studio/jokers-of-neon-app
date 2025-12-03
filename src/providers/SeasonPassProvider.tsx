import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSeasonProgress } from "../api/getSeasonProgress";
import { useDojo } from "../dojo/DojoContext";
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

const DEFAULT_API_BASE_URL = "http://localhost:3001";

export const SeasonPassProvider = ({ children }: PropsWithChildren) => {
  const {
    account: { account },
  } = useDojo();
  const [seasonPassUnlocked, setSeasonPassUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const userAddress = account?.address;
  const { offerings, purchasePackageById } = useRevenueCat();

  const fetchSeasonPassUnlocked = useCallback(async () => {
    if (!userAddress) {
      setSeasonPassUnlocked(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const progress = await getSeasonProgress({ userAddress });
      setSeasonPassUnlocked(Boolean(progress.seasonPassUnlocked));
    } catch (error) {
      console.error("Failed to fetch season pass status", error);
      setSeasonPassUnlocked(false);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchSeasonPassUnlocked();
  }, [fetchSeasonPassUnlocked]);

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

    setLoading(true);
    try {
      await purchasePackageById(seasonPassPackageId);
      await fetchSeasonPassUnlocked();
      setSeasonPassUnlocked(true);
      showPurchaseSuccessToast("season-pass");
    } catch (error) {
      console.error("Failed to purchase season pass", error);
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchSeasonPassUnlocked, seasonPassId, purchasePackageById, userAddress]);

  const value = useMemo(
    () => ({
      seasonPassUnlocked,
      loading,
      refetchSeasonPassUnlocked: fetchSeasonPassUnlocked,
      purchaseSeasonPass,
    }),
    [seasonPassUnlocked, loading, fetchSeasonPassUnlocked, purchaseSeasonPass]
  );

  return (
    <SeasonPassContext.Provider value={value}>
      {children}
    </SeasonPassContext.Provider>
  );
};

export const useSeasonPass = () => useContext(SeasonPassContext);
