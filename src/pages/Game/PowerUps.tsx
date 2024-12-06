import { Box, Flex } from "@chakra-ui/react";
import { AnimatedPowerUp } from "../../components/AnimatedPowerUp";
import CachedImage from "../../components/CachedImage";
import { useGameContext } from "../../providers/GameProvider";
import { BACKGROUND_BLUE, GREY_LINE } from "../../theme/colors";

export const PowerUps = () => {
  const { powerUps, powerUpIsPreselected, togglePreselectedPowerUp } =
    useGameContext();

  console.log("powerUps", powerUps);
  return (
    <Flex gap={4} zIndex={999}>
      {powerUps.map((powerUp, index) => {
        return powerUp ? (
          <AnimatedPowerUp idx={powerUp.idx}>
            <Flex
              key={`${powerUp.power_up_id}-${index}`}
              justifyContent="center"
              position="relative"
              height={`50px`}
              width={`100px`}
              borderRadius="full"
              background={"black"}
            >
              <CachedImage
                opacity={powerUpIsPreselected(powerUp.idx) ? 1 : 0.6}
                borderRadius="full"
                cursor="pointer"
                height={`${100}%`}
                width={`${100}%`}
                src={powerUp.img}
                onClick={() => {
                  togglePreselectedPowerUp(powerUp.idx);
                }}
              />
            </Flex>
          </AnimatedPowerUp>
        ) : (
          <EmptyPowerUp key={index} />
        );
      })}
    </Flex>
  );
};

const EmptyPowerUp = () => {
  return (
    <Box
      height={"46px"}
      border={`1px solid ${GREY_LINE}`}
      borderRadius="full"
      width={"93px"}
      mt={2}
      backgroundColor={BACKGROUND_BLUE}
    />
  );
};
