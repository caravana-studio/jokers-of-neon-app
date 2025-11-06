import { Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
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

  const { seasonPassUnlocked } = useSeasonPass();
  const { offerings } = useRevenueCat();
  const seasonPassPrice = offerings?.seasonPass?.formattedPrice ?? "$";
  const getPackPrice = (packId: number) => {
    const packageId = PACK_PACKAGE_IDS[packId];
    if (!packageId) {
      return undefined;
    }
    return offerings?.packs?.find((pack) => pack.id === packageId)
      ?.formattedPrice;
  };

  return (
    <DelayedLoading ms={200}>
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
          <Heading
            zIndex={10}
            fontSize={isSmallScreen ? "sm" : "lg"}
            variant="italic"
          >
            {t("title")}
          </Heading>
        </Flex>
        <Flex flexDir={"column"} gap={2} my={2}>
          {!seasonPassUnlocked && <SeasonPassRow price={seasonPassPrice} />}
          <PackRow
            packId={6}
            packageId={PACK_PACKAGE_IDS[6]}
            price={getPackPrice(6)}
          />
          <PackRow
            packId={5}
            packageId={PACK_PACKAGE_IDS[5]}
            price={getPackPrice(5)}
          />
          <PackRow
            packId={4}
            packageId={PACK_PACKAGE_IDS[4]}
            price={getPackPrice(4)}
          />
          <PackRow
            packId={3}
            packageId={PACK_PACKAGE_IDS[3]}
            price={getPackPrice(3)}
          />
          <PackRow
            packId={2}
            packageId={PACK_PACKAGE_IDS[2]}
            price={getPackPrice(2)}
          />
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
