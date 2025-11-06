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

export const ShopPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop",
  });

  const { seasonPassUnlocked } = useSeasonPass();
  const { offerings } = useRevenueCat();
  const seasonPassPrice = offerings?.seasonPass?.formattedPrice ?? "$";
  const findPackPrice = (identifier: string) =>
    offerings?.packs?.find((pack) => pack.id === identifier)?.formattedPrice;

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
          <PackRow packId={6} price={findPackPrice("pack_collector_xl")} />
          <PackRow packId={5} price={findPackPrice("pack_collector")} />
          <PackRow packId={4} price={findPackPrice("pack_legendary")} />
          <PackRow packId={3} price={findPackPrice("pack_epic")} />
          <PackRow packId={2} price={findPackPrice("pack_advanced")} />
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
