import { Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
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
};

export const ShopPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop",
  });

  const { seasonPassUnlocked, loading: loadingSeasonPass } = useSeasonPass();
  const { offerings } = useRevenueCat();
  const seasonPassPrice = offerings?.seasonPass?.formattedPrice;
  const getPackPrice = (packId: number) => {
    const packageId = PACK_PACKAGE_IDS[packId];
    if (!packageId) {
      return undefined;
    }
    return offerings?.packs?.find((pack) => pack.id === packageId)
      ?.formattedPrice;
  };
  const { distribution, loading } = useShopDistribution();

  const appType = useAppContext();
  const isShop = appType === AppType.SHOP;

  return (
    <DelayedLoading loading={loading || loadingSeasonPass}>
      <MobileDecoration fadeToBlack />
      <Flex
        flexDir={"column"}
        w="100%"
        h="100%"
        overflowY={"auto"}
        overflowX={"hidden"}
      >
        <Flex
          w="100%"
          borderBottom={`1px solid ${BLUE}`}
          height={isSmallScreen ? "60px" : "140px"}
          pt={isSmallScreen ? "25px" : "70px"}
          px={isSmallScreen ? "15px" : "30px"}
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
          my={2}
        >
          <SeasonPassRow
            price={seasonPassPrice}
            id={distribution?.season_pass ?? "season_pass"}
            unlocked={seasonPassUnlocked}
          />
          {distribution?.packs?.map((pack) => {
            return (
              <PackRow
                packId={pack.packId}
                packageId={pack.shopId}
                price={getPackPrice(pack.packId)}
              />
            );
          })}
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
