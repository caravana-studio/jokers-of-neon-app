import { Flex } from "@chakra-ui/react";
import { PowerUpComponent } from "../../components/PowerUpComponent";
import { preselectedCardSfx } from "../../constants/sfx";
import { useAudio } from "../../hooks/useAudio";
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
  const mobileWidth = 56;
  const { sfxVolume } = useSettings();

  const { play: preselectCardSound } = useAudio(preselectedCardSfx, sfxVolume);
  const componentWidth = isSmallScreen ? mobileWidth : "100%";

  return (
    <Flex
      width={isSmallScreen ? "auto" : "100%"}
      justifyContent={isSmallScreen ? "center" : "flex-start"}
      gap={isSmallScreen ? 1 : 0}
      flexWrap="nowrap"
      display={isSmallScreen ? "flex" : "grid"}
      gridTemplateColumns={isSmallScreen ? undefined : "repeat(4, minmax(0, 1fr))"}
      justifyItems={isSmallScreen ? undefined : "stretch"}
      alignItems="center"
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
            containerSx={isSmallScreen ? undefined : { mx: 0, width: "100%" }}
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
