import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import Joyride from "react-joyride";
import { BackgroundDecoration } from "../components/Background";
import { GalaxyBackground } from "../components/backgrounds/galaxy/GalaxyBackground";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { RewardsDetail } from "../components/RewardsDetail";
import { TUTORIAL_FLOATER_PROPS, TUTORIAL_STYLE } from "../constants/gameTutorial";
import { BOSS_LEVEL } from "../constants/general";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useProgressiveRewardsTutorial } from "../hooks/useProgressiveRewardsTutorial";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Intensity } from "../types/intensity";

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

  useEffect(() => {
    if (!roundRewards) {
      navigate(GameStateEnum.Map);
    }
  }, [navigate, roundRewards]);

  if (!roundRewards) {
    return <Flex w="100%" h="100%" />;
  }

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
          floaterProps={TUTORIAL_FLOATER_PROPS}
          locale={rewardsTutorialLocale}
          disableCloseOnEsc
          disableOverlayClose
          hideCloseButton
          spotlightClicks={false}
          disableScrolling
        />
        <GalaxyBackground
          intensity={
            roundRewards.level_passed
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
