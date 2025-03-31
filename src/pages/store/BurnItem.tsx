import { Box, Flex, Heading, Tooltip, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BurnIcon from "../../assets/burn.svg?component";
import { PriceBox } from "../../components/PriceBox";
import { useStore } from "../../providers/StoreProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import theme from "../../theme/theme";

interface IBurnItem {}

export const BurnItem = ({}: IBurnItem) => {
  const { cardScale, isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("store");
  const navigate = useNavigate();
  const { blueLight } = theme.colors;

  const { burnItem } = useStore();

  const price = burnItem?.cost;
  const purchased = burnItem?.purchased ?? false;

  return (
    <Tooltip label={t("store.burn-item.tooltip")} placement="top">
      <Flex
        width={"100%"}
        height={"100%"}
        alignItems={isSmallScreen ? "auto" : "center"}
        justifyContent={isSmallScreen ? "space-between" : "center"}
        flexDirection={isSmallScreen ? "row-reverse" : "column"}
        gap={"10%"}
        pt={isSmallScreen ? "0" : "10%"}
      >
        <Flex
          width={isSmallScreen ? "25%" : "50%"}
          cursor={purchased ? "not-allowed" : "pointer"}
          opacity={purchased ? 0.3 : 1}
          onClick={() => {
            if (!purchased) {
              navigate("/deck", { state: { inStore: true, burn: true } });
            }
          }}
        >
          <BurnIcon />
        </Flex>
        <Flex flexDirection={"column"} justifyContent={"space-evenly"}>
          {isSmallScreen && (
            <Flex>
              <Text fontSize={"sm"} textColor={blueLight}>
                {t("store.burn-item.tooltip")}
              </Text>
            </Flex>
          )}
          <Flex>
            {price && (
              <PriceBox
                price={Number(price)}
                purchased={Boolean(purchased)}
                discountPrice={Number(burnItem?.discount_cost ?? 0)}
                fontSize={isSmallScreen ? 20 : 16}
                discountFontSize={isSmallScreen ? 13 : 12}
                absolutePosition={false}
              />
            )}
            {purchased && (
              <Box>
                <Heading
                  variant="italic"
                  fontSize={isSmallScreen ? 6 : 11 * cardScale}
                >
                  {t("store.labels.purchased").toLocaleUpperCase()}
                </Heading>
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Tooltip>
  );
};
