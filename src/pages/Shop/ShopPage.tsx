import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CollectorPacksShopModal } from "../../components/CollectorPacksShopModal";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { DiscountSign } from "../../components/DiscountSign";
import { useSeasonNumber } from "../../constants/season";
import { AppType, useAppContext } from "../../providers/AppContextProvider";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { useShopDistribution } from "../../queries/useShopDistribution";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import {
  getPackPackageId,
  getPackTier,
  getSeasonalPackId,
  isCollectorPackId,
} from "../../utils/packUtils";
import { PackRow } from "./PackRow";
import { SeasonPassRow } from "./SeasonPassRow";

const discountOnShopFromEnv = Number(import.meta.env.VITE_DISCOUNT_ON_SHOP);
const DISCOUNT_ON_SHOP =
  Number.isFinite(discountOnShopFromEnv) && discountOnShopFromEnv > 0
    ? discountOnShopFromEnv
    : 0;

export const ShopPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const seasonNumber = useSeasonNumber();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop",
  });

  const { seasonPassUnlocked, loading: loadingSeasonPass } = useSeasonPass();
  const { offerings } = useRevenueCat();
  const seasonPassPrice = offerings?.seasonPass?.formattedPrice;

  const getPackPrice = (packId: number, shopId: string) => {
    const packageIds = [
      shopId,
      getPackPackageId(packId),
    ].filter((packageId): packageId is string => Boolean(packageId));

    return offerings?.packs?.find((pack) => packageIds.includes(pack.id))
      ?.formattedPrice;
  };

  const { distribution, loading } = useShopDistribution();
  const collectorPackIds =
    distribution?.packs
      ?.filter((pack) => isCollectorPackId(pack.packId))
      .map((pack) => pack.packId) ?? [];
  const hasCollectorPacks = !loading && collectorPackIds.length > 0;
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

  const appType = useAppContext();
  const isShop = appType === AppType.SHOP;

  return (
    <DelayedLoading loading={loading || loadingSeasonPass}>
      <MobileDecoration fadeToBlack />
      {DISCOUNT_ON_SHOP > 0 && <DiscountSign percentage={DISCOUNT_ON_SHOP} />}
      {hasCollectorPacks && (
        <CollectorPacksShopModal backgroundImage={collectorBackground} />
      )}
      <Flex
        flexDir={"column"}
        w="100%"
        h={isShop ? "auto" : "100%"}
        overflowY={isShop ? "visible" : "auto"}
        overflowX={"hidden"}
      >
        <Flex
          w="100%"
          borderBottom={`1px solid ${BLUE}`}
          height={isSmallScreen ? "60px" : "140px"}
          pt={isSmallScreen ? "25px" : "70px"}
          px={isShop ? 0 : isSmallScreen ? "15px" : "30px"}
          pb={3}
        >
          {!isShop && (
            <Heading
              zIndex={10}
              fontSize={isSmallScreen ? "sm" : "lg"}
              variant="italic"
            >
              {t("title")}
            </Heading>
          )}
        </Flex>
        <Flex
          flexDir={seasonPassUnlocked ? "column-reverse" : "column"}
          gap={2}
          my={isShop ? 0 : 2}
        >
          <SeasonPassRow
            price={seasonPassPrice}
            id={distribution?.season_pass ?? "season_pass"}
            unlocked={seasonPassUnlocked}
            fullBleed={isShop}
          />
          <Box>
            {distribution?.packs?.map((pack) => {
              return (
                <PackRow
                  key={pack.packId}
                  packId={pack.packId}
                  packageId={pack.shopId}
                  price={getPackPrice(pack.packId, pack.shopId)}
                  fullBleed={isShop}
                />
              );
            })}
          </Box>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
