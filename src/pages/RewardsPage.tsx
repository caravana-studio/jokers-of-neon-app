import { Flex } from "@chakra-ui/react";
import Joyride from "react-joyride";
import { BackgroundDecoration } from "../components/Background";
import { GalaxyBackground } from "../components/backgrounds/galaxy/GalaxyBackground";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { RewardsDetail } from "../components/RewardsDetail";
import { TUTORIAL_STYLE } from "../constants/gameTutorial";
import { BOSS_LEVEL } from "../constants/general";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useProgressiveRewardsTutorial } from "../hooks/useProgressiveRewardsTutorial";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Intensity } from "../types/intensity";
import { RoundRewards } from "../types/RoundRewards";

export const RewardsPage = () => {
  const { roundRewards } = useGameStore();
  const navigate = useCustomNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const {
    run: runRewardsTutorial,
    steps: rewardsTutorialSteps,
    locale: rewardsTutorialLocale,
    handleCallback: onRewardsTutorialCallback,
  } = useProgressiveRewardsTutorial();

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
    rewards_special_card: 0,
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
        <Joyride
          steps={rewardsTutorialSteps}
          run={runRewardsTutorial}
          continuous
          showProgress={false}
          callback={onRewardsTutorialCallback}
          styles={TUTORIAL_STYLE}
          locale={rewardsTutorialLocale}
          disableCloseOnEsc
          disableOverlayClose
          hideCloseButton
        />
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
