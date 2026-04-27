import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CollectorPacksShopModal } from "../../components/CollectorPacksShopModal";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { DiscountSign } from "../../components/DiscountSign";
import { AppType, useAppContext } from "../../providers/AppContextProvider";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { useShopDistribution } from "../../queries/useShopDistribution";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { PackRow } from "./PackRow";
import { SeasonPassRow } from "./SeasonPassRow";

const PACK_PACKAGE_IDS: Record<number, string> = {
  6: "pack_collector_xl",
  5: "pack_collector",
  4: "pack_legendary",
  3: "pack_epic",
  2: "pack_advanced",
  26: "pack_collector_xl_s2",
  25: "pack_collector_s2",
  24: "pack_legendary_s2",
  23: "pack_epic_s2",
  22: "pack_advanced_s2",
  36: "pack_collector_xl_s3",
  35: "pack_collector_s3",
  34: "pack_legendary_s3",
  33: "pack_epic_s3",
  32: "pack_advanced_s3",
  31: "pack_basic_s3",
};

const COLLECTOR_PACK_IDS = new Set([5, 6, 25, 26, 35, 36]);
const COLLECTOR_BACKGROUND_PRIORITY = [36, 26, 6, 35, 25, 5];

const discountOnShopFromEnv = Number(import.meta.env.VITE_DISCOUNT_ON_SHOP);
const DISCOUNT_ON_SHOP =
  Number.isFinite(discountOnShopFromEnv) && discountOnShopFromEnv > 0
    ? discountOnShopFromEnv
    : 0;

export const ShopPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop",
  });

  const { seasonPassUnlocked, loading: loadingSeasonPass } = useSeasonPass();
  const { offerings } = useRevenueCat();
  const seasonPassPrice = offerings?.seasonPass?.formattedPrice;
  const getPackPrice = (packId: number, shopId: string) => {
    const packageId = PACK_PACKAGE_IDS[packId] ?? shopId;
    return offerings?.packs?.find((pack) => pack.id === packageId)
      ?.formattedPrice;
  };
  const { distribution, loading } = useShopDistribution();
  const hasCollectorPacks =
    !loading &&
    !!distribution?.packs?.some((pack) => COLLECTOR_PACK_IDS.has(pack.packId));
  const collectorBackgroundPackId =
    COLLECTOR_BACKGROUND_PRIORITY.find((packId) =>
      distribution?.packs?.some((pack) => pack.packId === packId)
    ) ?? 5;
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
