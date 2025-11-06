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
import { SEASON_NUMBER } from "../constants/season";
import { useDojo } from "../dojo/DojoContext";
import { showPurchaseSuccessToast } from "../utils/transactionNotifications";
import { useRevenueCat } from "./RevenueCatProvider";

type SeasonPassContextValue = {
  seasonPassUnlocked: boolean;
  refetchSeasonPassUnlocked: () => Promise<void>;
  purchaseSeasonPass: () => Promise<void>;
};

const SeasonPassContext = createContext<SeasonPassContextValue>({
  seasonPassUnlocked: false,
  refetchSeasonPassUnlocked: async () => {},
  purchaseSeasonPass: async () => {},
});

const DEFAULT_API_BASE_URL = "http://localhost:3001";

export const SeasonPassProvider = ({ children }: PropsWithChildren) => {
  const {
    account: { account },
  } = useDojo();
  const [seasonPassUnlocked, setSeasonPassUnlocked] = useState(false);

  const userAddress = account?.address;
  const { offerings, purchasePackageById } = useRevenueCat();

  const fetchSeasonPassUnlocked = useCallback(async () => {
    if (!userAddress) {
      setSeasonPassUnlocked(false);
      return;
    }

    try {
      const progress = await getSeasonProgress({ userAddress });
      setSeasonPassUnlocked(Boolean(progress.seasonPassUnlocked));
    } catch (error) {
      console.error("Failed to fetch season pass status", error);
      setSeasonPassUnlocked(false);
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

    try {
      await purchasePackageById(seasonPassPackageId);

      const apiKey = import.meta.env.VITE_GAME_API_KEY;
      if (!apiKey) {
        throw new Error(
          "purchaseSeasonPass: Missing VITE_GAME_API_KEY environment variable"
        );
      }

      const baseUrl =
        import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
        DEFAULT_API_BASE_URL;

      const parsedSeasonId = Number(SEASON_NUMBER);
      const seasonId = Number.isFinite(parsedSeasonId) ? parsedSeasonId : 1;

      const response = await fetch(`${baseUrl}/api/season/purchase-pass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          address: userAddress,
          season_id: seasonId,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text().catch(() => "");
        throw new Error(
          `purchaseSeasonPass: ${response.status} ${response.statusText}${
            errorDetails ? ` - ${errorDetails}` : ""
          }`
        );
      }
      showPurchaseSuccessToast("season-pass");
      await fetchSeasonPassUnlocked();
    } catch (error) {
      console.error("Failed to purchase season pass", error);
      throw error;
    }
  }, [
    fetchSeasonPassUnlocked,
    seasonPassId,
    purchasePackageById,
    userAddress,
  ]);

  const value = useMemo(
    () => ({
      seasonPassUnlocked,
      refetchSeasonPassUnlocked: fetchSeasonPassUnlocked,
      purchaseSeasonPass,
    }),
    [seasonPassUnlocked, fetchSeasonPassUnlocked, purchaseSeasonPass]
  );

  return (
    <SeasonPassContext.Provider value={value}>
      {children}
    </SeasonPassContext.Provider>
  );
};

export const useSeasonPass = () => useContext(SeasonPassContext);
