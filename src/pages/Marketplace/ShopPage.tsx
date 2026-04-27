import { Box, Flex, Spinner } from "@chakra-ui/react";
import { PackRow } from "../Shop/PackRow";
import { SeasonPassRow } from "../Shop/SeasonPassRow";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { useShopDistribution } from "../../queries/useShopDistribution";
import { CollectorPacksShopModal } from "../../components/CollectorPacksShopModal";

const COLLECTOR_IDS = new Set([5, 6, 25, 26, 35, 36]);
const COLLECTOR_BACKGROUND_PRIORITY = [36, 26, 6, 35, 25, 5];

export function ShopPage() {
  const { distribution, loading } = useShopDistribution();
  const { offerings } = useRevenueCat();
  const { seasonPassUnlocked } = useSeasonPass();

  if (loading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner color="neonGreen" size="xl" />
      </Flex>
    );
  }

  const hasCollectorPacks = distribution?.packs?.some((p) => COLLECTOR_IDS.has(p.packId));
  const collectorBackgroundPackId =
    COLLECTOR_BACKGROUND_PRIORITY.find((packId) =>
      distribution?.packs?.some((pack) => pack.packId === packId)
    ) ?? 5;
  const collectorBackground = `/packs/bg/${collectorBackgroundPackId}.jpg`;

  const getPackPrice = (shopId: string) =>
    offerings?.packs?.find((p) => p.id === shopId)?.formattedPrice;
  const seasonPassPrice = offerings?.seasonPass?.formattedPrice;

  return (
    <>
      {hasCollectorPacks && <CollectorPacksShopModal backgroundImage={collectorBackground} />}

      <Box>
        {distribution?.season_pass && (
          <SeasonPassRow
            price={seasonPassPrice}
            id={distribution.season_pass}
            unlocked={seasonPassUnlocked}
            fullBleed
          />
        )}
        {distribution?.packs?.map((pack) => (
          <PackRow
            key={pack.packId}
            packId={pack.packId}
            packageId={pack.shopId}
            price={getPackPrice(pack.shopId)}
            fullBleed
          />
        ))}
      </Box>
    </>
  );
}
