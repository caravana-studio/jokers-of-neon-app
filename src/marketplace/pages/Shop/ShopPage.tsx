import { Box, Flex, Heading, Spinner, VStack } from "@chakra-ui/react";
import { useShopDistribution } from "../../hooks/useShopDistribution";
import { CollectorPacksShopModal } from "../../components/CollectorPacksShopModal";
import { PackRow } from "./PackRow";
import { SeasonPassRow } from "./SeasonPassRow";

const COLLECTOR_IDS = new Set([5, 6, 25, 26]);

export function ShopPage() {
  const { distribution, loading } = useShopDistribution();

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
    : distribution?.packs?.some((p) => p.packId === 25)
      ? "/packs/bg/25.jpg"
      : "/packs/bg/25.jpg";

  return (
    <>
      {hasCollectorPacks && <CollectorPacksShopModal backgroundImage={collectorBackground} />}

      <VStack spacing={5} align="stretch">
        <Heading size="l" variant="neonGreen">Shop</Heading>

        {/* Full-width breakout: always fills viewport regardless of parent max-width */}
        <Box
          position="relative"
          left="50%"
          transform="translateX(-50%)"
          width="100vw"
          overflowX="hidden"
        >
          {distribution?.season_pass && (
            <SeasonPassRow productId={distribution.season_pass} />
          )}
          {distribution?.packs?.map((pack) => (
            <PackRow
              key={pack.packId}
              packId={pack.packId}
              shopId={pack.shopId}
            />
          ))}
        </Box>
      </VStack>
    </>
  );
}
