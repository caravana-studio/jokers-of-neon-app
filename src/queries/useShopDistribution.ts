import { useEffect, useState } from "react";
import { useSeasonNumber } from "../constants/season";
import {
  getPackPackageId,
  getPackTier,
  getSeasonPassPackageId,
  getSeasonalPackId,
} from "../utils/packUtils";
import { isNativeAndroid, isNativeIOS } from "../utils/capacitorUtils";

type ShopEnvironment = "android" | "ios" | "web";

export interface ShopPack {
  shopId: string;
  packId: number;
}

export interface ShopDistribution {
  season_pass: string;
  packs: ShopPack[];
}

type ShopDistributionResponse = Partial<
  Record<ShopEnvironment, ShopDistribution>
>;

const SHOP_DISTRIBUTION_URL =
  "https://jokersofneon.com/app/settings/shop.json";
const FORCE_DEFAULTS_ON_SHOP =
  String(import.meta.env.VITE_FORCE_DEFAULTS_ON_SHOP).toLowerCase() ===
  "true";

const DEFAULT_SHOP_TIERS = [2, 3, 4];

const getDefaultShopDistribution = (
  environment: ShopEnvironment,
  season: number
): ShopDistribution => {
  const packs =
    environment === "android"
      ? []
      : DEFAULT_SHOP_TIERS.map((tier) => {
          const packId = getSeasonalPackId(tier, season);
          return {
            packId,
            shopId: getPackPackageId(packId, season) ?? "",
          };
        }).filter((pack) => pack.shopId.length > 0);

  return {
    season_pass: getSeasonPassPackageId(season),
    packs,
  };
};

const getEnvironment = (): ShopEnvironment => {
  if (isNativeAndroid) {
    return "android";
  }
  if (isNativeIOS) {
    return "ios";
  }
  return "web";
};

export const useShopDistribution = () => {
  const seasonNumber = useSeasonNumber();
  const [distribution, setDistribution] = useState<ShopDistribution | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const normalizeDistribution = (
      source: ShopDistribution,
      season: number
    ): ShopDistribution => {
      const seenPackIds = new Set<number>();
      const packs: ShopPack[] = [];

      for (const pack of source.packs ?? []) {
        const tier = getPackTier(Number(pack.packId));
        if (tier <= 0) {
          continue;
        }

        const seasonalPackId = getSeasonalPackId(tier, season);
        if (seasonalPackId <= 0 || seenPackIds.has(seasonalPackId)) {
          continue;
        }

        seenPackIds.add(seasonalPackId);
        packs.push({
          packId: seasonalPackId,
          shopId:
            getPackPackageId(seasonalPackId, season) ??
            (typeof pack.shopId === "string" ? pack.shopId : ""),
        });
      }

      return {
        season_pass: getSeasonPassPackageId(season),
        packs: packs.filter((pack) => pack.shopId.length > 0),
      };
    };

    const fetchShopDistribution = async () => {
      setLoading(true);
      const environment = getEnvironment();
      const defaultDistribution = getDefaultShopDistribution(
        environment,
        seasonNumber
      );
      if (FORCE_DEFAULTS_ON_SHOP) {
        if (!cancelled) {
          setDistribution(defaultDistribution);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(SHOP_DISTRIBUTION_URL);
        if (!response.ok) {
          console.error("Failed to fetch shop distribution settings");
          if (!cancelled) {
            setDistribution(defaultDistribution);
          }
          return;
        }

        const data: ShopDistributionResponse = await response.json();
        const environmentDistribution =
          data?.[environment] ?? data?.web ?? defaultDistribution;

        if (!cancelled) {
          setDistribution(
            normalizeDistribution(environmentDistribution, seasonNumber)
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch shop distribution settings. Unknown error occurred",
          err
        );
        if (!cancelled) {
          setDistribution(defaultDistribution);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchShopDistribution();

    return () => {
      cancelled = true;
    };
  }, [seasonNumber]);

  return { distribution, loading };
};
