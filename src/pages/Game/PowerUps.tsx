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
  const { powerUps, togglePreselectedPowerUp, preSelectedPowerUps } =
    useGameStore();
  const { preSelectionLocked } = useCurrentHandStore();
  const { isSmallScreen } = useResponsiveValues();
  const width = isSmallScreen ? 60 : 93;
  const componentWidth = isSmallScreen ? width - 4 : width - 10;
  const { sfxVolume } = useSettings();

  const { play: preselectCardSound } = useAudio(preselectedCardSfx, sfxVolume);

  return (
    <Flex
      gap={[1, 4]}
      position="relative"
      zIndex={preSelectionLocked ? 70 : 80}
      pointerEvents="auto"
      className="game-tutorial-power-up"
    >
      {powerUps?.map((powerUp, index) => {
        const isActive = !!powerUp && preSelectedPowerUps.includes(powerUp.idx);
        return (
          <PowerUpComponent
            key={powerUp?.idx ?? index}
            width={componentWidth}
            powerUp={powerUp}
            isActive={isActive}
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
