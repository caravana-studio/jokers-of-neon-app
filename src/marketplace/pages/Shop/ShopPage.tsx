import { Box, Flex, Heading, Spinner, VStack } from "@chakra-ui/react";
import { PackRow } from "../../../pages/Shop/PackRow";
import { SeasonPassRow } from "../../../pages/Shop/SeasonPassRow";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";
import { useSeasonPass } from "../../../providers/SeasonPassProvider";
import { useShopDistribution } from "../../hooks/useShopDistribution";
import { CollectorPacksShopModal } from "../../components/CollectorPacksShopModal";

const COLLECTOR_IDS = new Set([5, 6, 25, 26]);

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
  const collectorBackground = distribution?.packs?.some((p) => p.packId === 26)
    ? "/packs/bg/26.jpg"
    : "/packs/bg/25.jpg";

  const getPackPrice = (shopId: string) =>
    offerings?.packs?.find((p) => p.id === shopId)?.formattedPrice;
  const seasonPassPrice = offerings?.seasonPass?.formattedPrice;

  return (
    <>
      {hasCollectorPacks && <CollectorPacksShopModal backgroundImage={collectorBackground} />}

      <VStack spacing={5} align="stretch">
        <Heading size="l" variant="neonGreen">Shop</Heading>

        <Box
          position="relative"
          left="50%"
          transform="translateX(-50%)"
          width="100vw"
          overflowX="hidden"
        >
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
      </VStack>
    </>
  );
}
