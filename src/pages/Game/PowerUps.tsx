import { Flex } from "@chakra-ui/react";
import { PowerUpComponent } from "../../components/PowerUpComponent";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface PowerUpsProps {
  onTutorialCardClick?: () => void;
}

export const PowerUps = ({ onTutorialCardClick }: PowerUpsProps) => {
  const { powerUps, togglePreselectedPowerUp } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();
  const width = isSmallScreen ? 60 : 93;
  const componentWidth = isSmallScreen ? width - 4 : width - 10;

  return (
    <Flex gap={[1, 4]} zIndex={1} className="game-tutorial-power-up">
      {powerUps.map((powerUp, index) => {
        return (
          <PowerUpComponent
            key={index}
            width={componentWidth}
            powerUp={powerUp}
            onClick={() => {
              if (powerUp) {
                togglePreselectedPowerUp(powerUp.idx);
              }
              if (onTutorialCardClick) onTutorialCardClick();
            }}
          />
        );
      })}
    </Flex>
  );
};
