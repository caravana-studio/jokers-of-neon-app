import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { LevelUpFirstDiscartedHandAnimation } from "../../components/animations/LevelUpFirstDiscartedHandAnimation";
import { SecondChanceCardAnimation } from "../../components/animations/SecondChanceCardAnimation";
import { SpecialCardAnimation } from "../../components/animations/SpecialCardAnimation";
import { DelayedLoading } from "../../components/DelayedLoading";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";
import { useAnimationStore } from "../../state/useAnimationStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { PracticeContent } from "./PracticeContent";
import { PracticeSetupStep } from "./PracticeSetupStep";

export const PracticePage = () => {
  const { animateSecondChanceCard, animateSpecialCardDefault } =
    useCardAnimations();
  const { isSmallScreen } = useResponsiveValues();
  const playAnimation = useAnimationStore((store) => store.playAnimation);
  const [showSetupStep, setShowSetupStep] = useState(true);
  const hasPlayedAnimationRef = useRef(false);

  useEffect(() => {
    if (playAnimation) {
      hasPlayedAnimationRef.current = true;
      return;
    }

    if (hasPlayedAnimationRef.current && !showSetupStep) {
      hasPlayedAnimationRef.current = false;
      setShowSetupStep(true);
    }
  }, [playAnimation, showSetupStep]);

  if (isSmallScreen) {
    return (
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Heading size="md" variant="neonGreen">
          Practice screen is desktop only
        </Heading>
      </Box>
    );
  }

  if (showSetupStep) {
    return <PracticeSetupStep onStart={() => setShowSetupStep(false)} />;
  }

  return (
    <DelayedLoading ms={200}>
      <LevelUpFirstDiscartedHandAnimation />
      {animateSecondChanceCard && <SecondChanceCardAnimation />}
      {animateSpecialCardDefault && (
        <SpecialCardAnimation
          specialId={animateSpecialCardDefault.specialId}
          bgPath={animateSpecialCardDefault.bgPath}
          animatedImgPath={animateSpecialCardDefault.animatedImgPath}
        />
      )}
      <PracticeContent onBackToSetup={() => setShowSetupStep(true)} />
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </DelayedLoading>
  );
};
