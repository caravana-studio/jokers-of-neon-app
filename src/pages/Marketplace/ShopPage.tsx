import { Box, Flex, Spinner } from "@chakra-ui/react";
import { PackRow } from "../Shop/PackRow";
import { SeasonPassRow } from "../Shop/SeasonPassRow";
import { useSeasonNumber } from "../../constants/season";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { useShopDistribution } from "../../queries/useShopDistribution";
import { CollectorPacksShopModal } from "../../components/CollectorPacksShopModal";
import {
  getPackTier,
  getSeasonalPackId,
  isCollectorPackId,
} from "../../utils/packUtils";

export function ShopPage() {
  const seasonNumber = useSeasonNumber();
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

  const collectorPackIds =
    distribution?.packs
      ?.filter((pack) => isCollectorPackId(pack.packId))
      .map((pack) => pack.packId) ?? [];
  const hasCollectorPacks = collectorPackIds.length > 0;
  const collectorBackgroundPackId =
    [...collectorPackIds].sort((leftPackId, rightPackId) => {
      const tierDifference =
        getPackTier(rightPackId) - getPackTier(leftPackId);
      if (tierDifference !== 0) {
        return tierDifference;
      }
      return rightPackId - leftPackId;
    })[0] ?? getSeasonalPackId(5, seasonNumber);
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
