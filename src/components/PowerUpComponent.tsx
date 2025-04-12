import {
  Box,
  Flex,
  Heading,
  SystemStyleObject,
  Tooltip,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { getPowerUpData } from "../data/powerups";
import { useGameContext } from "../providers/GameProvider";
import { BACKGROUND_BLUE, GREY_LINE } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { PowerUp } from "../types/Powerup/PowerUp";
import { colorizeText } from "../utils/getTooltip";
import { AnimatedPowerUp } from "./AnimatedPowerUp";
import CachedImage from "./CachedImage";
import { PriceBox } from "./PriceBox";
import { FadingParticleAnimation } from "./animations/FadingParticlesAnimation";
import { PurchasedLbl } from "./PurchasedLbl";

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
  const { powerUpIsPreselected } = useGameContext();
  const calculatedIsActive =
    isActive ?? (powerUp && powerUpIsPreselected(powerUp.idx));
  const price = inStore && powerUp?.cost;
  const discount_cost = inStore && powerUp?.discount_cost;
  const purchased = inStore && powerUp?.purchased;
  const { cardScale, isSmallScreen } = useResponsiveValues();

  const description =
    powerUp?.power_up_id && getPowerUpData(powerUp.power_up_id)?.description;

  const powerupStyle = powerUp?.style;

  return powerUp ? (
    <FadingParticleAnimation
      width={isSmallScreen ? 120 : 190}
      height={isSmallScreen ? 35 : 70}
      spriteSrc={powerupStyle?.vfx ?? ""}
      particleSize={5}
      amount={isSmallScreen ? 300 : 500}
      delayRange={3}
      minHeight={5}
      backward
      active={calculatedIsActive ?? false}
      spreadOffset={0.3}
    >
      <AnimatedPowerUp idx={powerUp.idx}>
        <Tooltip label={description && colorizeText(description)}>
          <Flex
            justifyContent="center"
            position="relative"
            width={`${width}px`}
            borderRadius={"22%"}
            background={"black"}
            transform={calculatedIsActive ? "scale(1.1)" : "scale(1)"}
            transition="all 0.2s ease-in-out"
            cursor={purchased ? "not-allowed" : "pointer"}
            opacity={purchased ? 0.3 : 1}
            onClick={onClick}
          >
            {price && (
              <PriceBox
                price={Number(price)}
                purchased={Boolean(purchased)}
                isPowerUp={!inStore}
                fontSize={isSmallScreen ? 12 : 16}
                discountFontSize={isSmallScreen ? 10 : 12}
                discountPrice={Number(discount_cost)}
              />
            )}
            <PurchasedLbl
              purchased={purchased ?? false}
              topOffset={`${isSmallScreen ? width / 3 - 10 : width / 3 - 15}px`}
              fontSize={isSmallScreen ? 6 : 11 * cardScale}
            />
            <Box
              {...(calculatedIsActive && {
                border: "solid 1px white",
                borderRadius: `${isSmallScreen ? "10px" : "14px"}`,
                boxShadow: `
                  0 0 20px ${powerupStyle?.shadowLightColor},     
                  0 0 40px ${powerupStyle?.shadowColor},      
                  inset 0 0 10px ${powerupStyle?.shadowColor} 
                `,
              })}
            >
              <CachedImage
                opacity={inStore || calculatedIsActive ? 1 : 0.6}
                borderRadius={"18%"}
                cursor="pointer"
                height={`${100}%`}
                width={`${100}%`}
                src={powerUp.img}
              />
            </Box>
          </Flex>
        </Tooltip>
      </AnimatedPowerUp>
    </FadingParticleAnimation>
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
      borderRadius={{ base: "10px", sm: "15px" }}
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
