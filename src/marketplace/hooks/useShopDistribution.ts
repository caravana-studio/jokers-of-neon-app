import { useEffect, useState } from "react";

export interface ShopPack {
  shopId: string;
  packId: number;
}

export interface ShopDistribution {
  season_pass: string;
  packs: ShopPack[];
}

const SHOP_DISTRIBUTION_URL = "https://jokersofneon.com/app/settings/shop.json";

const DEFAULT: ShopDistribution = {
  season_pass: "season_pass_s2",
  packs: [
    { shopId: "pack_advanced_s2",     packId: 22 },
    { shopId: "pack_epic_s2",         packId: 23 },
    { shopId: "pack_legendary_s2",    packId: 24 },
    { shopId: "pack_collector_s2",    packId: 25 },
    { shopId: "pack_collector_xl_s2", packId: 26 },
  ],
};

export function useShopDistribution() {
  const [distribution, setDistribution] = useState<ShopDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SHOP_DISTRIBUTION_URL)
      .then((r) => r.json())
      .then((data) => setDistribution(data?.web ?? DEFAULT))
      .catch(() => setDistribution(DEFAULT))
      .finally(() => setLoading(false));
  }, []);

  return { distribution, loading };
}
