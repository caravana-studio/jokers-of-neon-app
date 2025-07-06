import { Flex } from "@chakra-ui/react";
import { PowerUpComponent } from "../../components/PowerUpComponent";
import { preselectedCardSfx } from "../../constants/sfx";
import { useAudio } from "../../hooks/useAudio";
import { useGameContext } from "../../providers/GameProvider";
import { useSettings } from "../../providers/SettingsProvider";
import { useCurrentHandStore } from "../../state/useCurrentHandStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { useGameStore } from "../../state/useGameStore";

interface PowerUpsProps {
  onTutorialCardClick?: () => void;
}

export const PowerUps = ({ onTutorialCardClick }: PowerUpsProps) => {
  const { powerUps, togglePreselectedPowerUp } = useGameStore();
  const { preSelectionLocked } = useCurrentHandStore();
  const { isSmallScreen } = useResponsiveValues();
  const width = isSmallScreen ? 60 : 93;
  const componentWidth = isSmallScreen ? width - 4 : width - 10;
  const { sfxVolume } = useSettings();

  const { play: preselectCardSound } = useAudio(preselectedCardSfx, sfxVolume);

  return (
    <Flex
      gap={[1, 4]}
      zIndex={preSelectionLocked ? 1 : 2}
      className="game-tutorial-power-up"
    >
      {powerUps.map((powerUp, index) => {
        return (
          <PowerUpComponent
            key={index}
            width={componentWidth}
            powerUp={powerUp}
            onClick={() => {
              if (powerUp) {
                const result = togglePreselectedPowerUp(powerUp.idx);
                result && preselectCardSound();
              }
              if (onTutorialCardClick) onTutorialCardClick();
            }}
          />
        );
      })}
    </Flex>
  );
};
