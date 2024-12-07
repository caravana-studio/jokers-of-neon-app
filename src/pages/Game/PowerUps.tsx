import { Flex } from "@chakra-ui/react";
import { PowerUpComponent } from "../../components/PowerUpComponent";
import { useGameContext } from "../../providers/GameProvider";

export const PowerUps = () => {
  const { powerUps, togglePreselectedPowerUp } = useGameContext();

  return (
    <Flex gap={4} zIndex={1}>
      {powerUps.map((powerUp, index) => {
        return (
          <PowerUpComponent
            key={index}
            width={93}
            powerUp={powerUp}
            onClick={() => powerUp && togglePreselectedPowerUp(powerUp.idx)}
          />
        );
      })}
    </Flex>
  );
};
