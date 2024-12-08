import { Flex } from "@chakra-ui/react";
import { PowerUpComponent } from "../../components/PowerUpComponent";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const PowerUps = () => {
  const { powerUps, togglePreselectedPowerUp } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex gap={[1,4]} zIndex={1}>
      {powerUps.map((powerUp, index) => {
        return (
          <PowerUpComponent
            key={index}
            width={isSmallScreen ? 60 : 93}
            powerUp={powerUp}
            onClick={() => powerUp && togglePreselectedPowerUp(powerUp.idx)}
          />
        );
      })}
    </Flex>
  );
};
