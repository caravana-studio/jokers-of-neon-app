import {
  Flex,
  ResponsiveValue,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Duration } from "../enums/duration";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { CashSymbol } from "./CashSymbol";
import { DefaultInfo } from "./Info/DefaultInfo";

interface DurationSwitcherProps {
  price?: number;
  temporalPrice?: number;
  discountPrice?: number;
  temporalDiscountPrice?: number;
  duration: Duration;
  onDurationChange: (duration: Duration) => void;
  flexDir?: "row" | "row-reverse" | "column" | "column-reverse";
}

export const DurationSwitcher = ({
  price,
  temporalPrice,
  discountPrice,
  temporalDiscountPrice,
  duration,
  onDurationChange,
  flexDir,
}: DurationSwitcherProps) => {
  const { t } = useTranslation("store", { keyPrefix: "store.preview-card" });
  const { isSmallScreen } = useResponsiveValues();
  const discountPriceFontSize = isSmallScreen ? 8 : 12;
  const priceFontSize = isSmallScreen ? 12 : 18;
  const discountPriceLineHeight = isSmallScreen ? 0.5 : 0.7;
  const priceLineHeight = isSmallScreen ? 1 : 1.2;

  flexDir = flexDir || (isSmallScreen ? "column" : "row-reverse");

  return (
    <Flex
      gap={isSmallScreen ? 0 : 4}
      alignItems="center"
      justifyContent="center"
      mt={3}
      flexDir={flexDir}
      onClick={(event) => event.stopPropagation()}
    >
      <Flex justifyContent="center" alignItems="center" gap={2}>
        <Text size="md">
          {duration === Duration.TEMPORAL ? t("temporal") : t("permanent")}
        </Text>
        <DefaultInfo
          title={duration === Duration.TEMPORAL ? "temporal" : "permanent"}
        />
      </Flex>
      <Tabs
        index={duration}
        onChange={onDurationChange}
        w="100%"
        isFitted
        color="white"
        mt={2}
        variant="secondary"
      >
        <TabList>
          <Tab>
            <Flex flexDir="column">
              <Text
                sx={{
                  textDecoration: discountPrice ? "line-through" : "none",
                  fontSize: discountPrice
                    ? discountPriceFontSize
                    : priceFontSize,
                  lineHeight: discountPrice
                    ? discountPriceLineHeight
                    : priceLineHeight,
                }}
              >
                {price}
                <CashSymbol />
              </Text>
              {discountPrice && discountPrice > 0 ? (
                <Text fontSize={priceFontSize} lineHeight={priceLineHeight}>
                  {discountPrice}
                  <CashSymbol />
                </Text>
              ) : (
                <></>
              )}
            </Flex>
          </Tab>
          <Tab>
            <Flex flexDir="column">
              <Text
                sx={{
                  textDecoration: temporalDiscountPrice
                    ? "line-through"
                    : "none",
                  fontSize: temporalDiscountPrice
                    ? discountPriceFontSize
                    : priceFontSize,
                  lineHeight: temporalDiscountPrice
                    ? discountPriceLineHeight
                    : priceLineHeight,
                }}
              >
                {temporalPrice}
                <CashSymbol />
              </Text>
              {temporalDiscountPrice && temporalDiscountPrice > 0 ? (
                <Text fontSize={priceFontSize} lineHeight={1}>
                  {temporalDiscountPrice}
                  <CashSymbol />
                </Text>
              ) : (
                <></>
              )}
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
    </Flex>
  );
};
