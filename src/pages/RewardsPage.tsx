import { Flex } from "@chakra-ui/react";
import { BackgroundDecoration } from "../components/Background";
import { GalaxyBackground } from "../components/backgrounds/galaxy/GalaxyBackground";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { RewardsDetail } from "../components/RewardsDetail";
import { BOSS_LEVEL } from "../constants/general";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Intensity } from "../types/intensity";

export const RewardsPage = () => {
  const { roundRewards } = useGameStore();
  const navigate = useCustomNavigate();
  const { isSmallScreen } = useResponsiveValues();

  if (!roundRewards) {
    navigate(GameStateEnum.Map);
  }

  return (
    <DelayedLoading ms={0}>
      <BackgroundDecoration>
        <GalaxyBackground
          intensity={
            roundRewards?.level_passed
              ? roundRewards.level_passed === BOSS_LEVEL
                ? Intensity.MAX
                : Intensity.HIGH
              : Intensity.LOW
          }
        />
        {isSmallScreen && <MobileDecoration />}
        <RewardsDetail roundRewards={roundRewards} />
      </BackgroundDecoration>
    </DelayedLoading>
  );
};
