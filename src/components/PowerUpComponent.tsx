import {
  Box,
  Flex,
  Heading,
  SystemStyleObject,
  Tooltip,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { POWER_UPS_CARDS_DATA } from "../data/powerups";
import { useGameContext } from "../providers/GameProvider";
import { BACKGROUND_BLUE, GREY_LINE } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { PowerUp } from "../types/PowerUp";
import { colorizeText } from "../utils/getTooltip";
import { AnimatedPowerUp } from "./AnimatedPowerUp";
import CachedImage from "./CachedImage";
import { PriceBox } from "./PriceBox";

interface PowerUpProps {
  powerUp: PowerUp | null;
  width: number;
  onClick?: () => void;
  inStore?: boolean;
  containerSx?: SystemStyleObject;
  isActive?: boolean;
}
export const PowerUpComponent = ({
  powerUp,
  onClick,
  inStore = false,
  width,
  containerSx,
  isActive,
}: PowerUpProps) => {
  const { t } = useTranslation(["store"]);

  const { powerUpIsPreselected } = useGameContext();
  const calculatedIsActive =
    isActive ?? (powerUp && powerUpIsPreselected(powerUp.idx));
  const price = inStore && powerUp?.cost;
  const discount_cost = inStore && powerUp?.discount_cost;
  const purchased = inStore && powerUp?.purchased;
  const { cardScale, isSmallScreen } = useResponsiveValues();

  const description =
    powerUp?.power_up_id &&
    POWER_UPS_CARDS_DATA[powerUp.power_up_id]?.description;

  return powerUp ? (
    <AnimatedPowerUp idx={powerUp.idx}>
      <Tooltip label={description && colorizeText(description)}>
        <Flex
          justifyContent="center"
          position="relative"
          width={`${width}px`}
          borderRadius="17px"
          background={"black"}
          transform={calculatedIsActive ? "scale(1.1)" : "scale(1)"}
          transition="all 0.2s ease-in-out"
          cursor={purchased ? "not-allowed" : "pointer"}
          opacity={purchased ? 0.3 : 1}
        >
          {price && (
            <PriceBox
              price={Number(price)}
              purchased={Boolean(purchased)}
              isPowerUp
              fontSize={isSmallScreen ? 12 : 16}
              discountFontSize={isSmallScreen ? 10 : 12}
              discountPrice={Number(discount_cost)}
            />
          )}
          {purchased && (
            <Box
              sx={{
                position: "absolute",
                top: `${width / 3 - 15}px`,
                left: -1,
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
            opacity={inStore || calculatedIsActive ? 1 : 0.6}
            borderRadius={["12px", "17px"]}
            cursor="pointer"
            height={`${100}%`}
            width={`${100}%`}
            src={powerUp.img}
            onClick={onClick}
          />
        </Flex>
      </Tooltip>
    </AnimatedPowerUp>
  ) : (
    <EmptyPowerUp width={width} containerSx={containerSx} />
  );
};

const EmptyPowerUp = ({
  width,
  containerSx,
}: {
  width: number;
  containerSx?: SystemStyleObject;
}) => {
  const { isSmallScreen } = useResponsiveValues();
  const { isRageRound, isClassic } = useGameContext();
  return (
    <Box
      height={`${isSmallScreen ? width / 1.8 : width / 1.9}px`}
      border={`1px solid ${GREY_LINE}`}
      borderRadius={["12px", "17px"]}
      width={`${width}px`}
      mt={isSmallScreen ? 1.5 : 2.5}
      mx={2}
      backgroundColor={
        isClassic ? (isRageRound ? "black" : BACKGROUND_BLUE) : "transparent"
      }
      sx={containerSx}
    />
  );
};
