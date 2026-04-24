import { useEffect, useState } from "react";
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

const DEFAULT_SHOP_DISTRIBUTIONS: Record<ShopEnvironment, ShopDistribution> = {
  android: {
    season_pass: "season_pass_s3",
    packs: [],
  },
  ios: {
    season_pass: "season_pass_s3",
    packs: [
      { shopId: "pack_advanced_s3", packId: 32 },
      { shopId: "pack_epic_s3", packId: 33 },
      { shopId: "pack_legendary_s3", packId: 34 },
    ],
  },
  web: {
    season_pass: "season_pass_s3",
    packs: [
      { shopId: "pack_advanced_s3", packId: 32 },
      { shopId: "pack_epic_s3", packId: 33 },
      { shopId: "pack_legendary_s3", packId: 34 },
    ],
  },
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
  const [distribution, setDistribution] = useState<ShopDistribution | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopDistribution = async () => {
      const environment = getEnvironment();
      if (FORCE_DEFAULTS_ON_SHOP) {
        setDistribution({ ...DEFAULT_SHOP_DISTRIBUTIONS[environment] });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(SHOP_DISTRIBUTION_URL);
        if (!response.ok) {
          console.error("Failed to fetch shop distribution settings");
          setDistribution({ ...DEFAULT_SHOP_DISTRIBUTIONS[environment] });
          return;
        }

        const data: ShopDistributionResponse = await response.json();
        const environmentDistribution =
          data?.[environment] ??
          data?.web ??
          DEFAULT_SHOP_DISTRIBUTIONS[environment];

        setDistribution({ ...environmentDistribution });
      } catch (err) {
        console.error(
          "Failed to fetch shop distribution settings. Unknown error occurred",
          err
        );
        setDistribution({ ...DEFAULT_SHOP_DISTRIBUTIONS[environment] });
      } finally {
        setLoading(false);
      }
    };

    fetchShopDistribution();
  }, []);

  return { distribution, loading };
};
