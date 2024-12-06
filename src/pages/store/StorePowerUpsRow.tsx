import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage";
import { PriceBox } from "../../components/PriceBox";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { useStore } from "../../providers/StoreProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const StorePowerUpsRow = () => {
  const { powerUps } = useStore();

  const { t } = useTranslation(["store"]);
  const navigate = useNavigate();

  const { cardScale, isSmallScreen } = useResponsiveValues();

  const adjustedScale = isSmallScreen
    ? cardScale
    : cardScale - (cardScale * 25) / 100;

  const height = CARD_HEIGHT * adjustedScale;
  const width = CARD_WIDTH * adjustedScale;

  return (
    <Box mb={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading
          size={{ base: "s", sm: "xs" }}
          mb={[1, 1, 1, 2, 2]}
          fontWeight={"400"}
        >
          {t("store.titles.powerups")}
        </Heading>
      </Flex>

      <Flex
        flexDirection="row"
        justifyContent="flex-start"
        wrap={"nowrap"}
        gap={[2, 4, 6]}
      >
        {powerUps.map((powerUp, index) => {
          const price = powerUp?.cost;
          const purchased = powerUp?.purchased ?? false;
          return (
            <Flex
              key={`${powerUp.power_up_id}-${index}`}
              justifyContent="center"
              position="relative"
              height={`${height}px`}
              width={`${width}px`}
              cursor={purchased ? "not-allowed" : "pointer"}
              opacity={purchased ? 0.3 : 1}
            >
              {price && (
                <PriceBox
                  price={Number(price)}
                  purchased={Boolean(purchased)}
                />
              )}
              {purchased && (
                <Box
                  sx={{
                    position: "absolute",
                    top: `${height / 2 - 10}px`,
                    left: 0,
                    zIndex: 10,
                  }}
                >
                  <Heading
                    variant="italic"
                    fontSize={isSmallScreen ? 6 : 11 * cardScale}
                  >
                    {t("store.labels.purchased").toLocaleUpperCase()}
                  </Heading>
                </Box>
              )}
              <CachedImage
                cursor="pointer"
                height={`${height}px`}
                width={`${width}px`}
                src={powerUp.img}
                onClick={() => {
                  if (!powerUp.purchased) {
                    navigate("/preview/power-up", {
                      state: { powerUp },
                    });
                  }
                }}
              />
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
