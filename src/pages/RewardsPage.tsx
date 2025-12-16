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
import { RoundRewards } from "../types/RoundRewards";

export const RewardsPage = () => {
  const { roundRewards } = useGameStore();
  const navigate = useCustomNavigate();
  const { isSmallScreen } = useResponsiveValues();

  const fakeRoundRewards: RoundRewards = {
    roundNumber: 5,
    round_defeat: 1200,
    level_bonus: 300,
    hands_left: 2,
    hands_left_cash: 200,
    discard_left: 1,
    discard_left_cash: 100,
    rage_card_defeated: 1,
    rage_card_defeated_cash: 250,
    rerolls: 2,
    total: 2050,
    level_passed: 3,
  };

  const rewardsToShow = roundRewards ?? fakeRoundRewards;

/*   if (!roundRewards) {
    navigate(GameStateEnum.Map);
  } */

  return (
    <DelayedLoading ms={0}>
      <BackgroundDecoration>
        <GalaxyBackground
          intensity={
            rewardsToShow?.level_passed
              ? rewardsToShow.level_passed === BOSS_LEVEL
                ? Intensity.MAX
                : Intensity.HIGH
              : Intensity.LOW
          }
        />
        {isSmallScreen && <MobileDecoration />}
        <RewardsDetail roundRewards={rewardsToShow} />
      </BackgroundDecoration>
    </DelayedLoading>
  );
};
