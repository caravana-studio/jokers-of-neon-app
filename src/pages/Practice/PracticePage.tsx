import { Box, Heading } from "@chakra-ui/react";
import { RemoveScroll } from "react-remove-scroll";
import { LevelUpFirstDiscartedHandAnimation } from "../../components/animations/LevelUpFirstDiscartedHandAnimation";
import { SecondChanceCardAnimation } from "../../components/animations/SecondChanceCardAnimation";
import { SpecialCardAnimation } from "../../components/animations/SpecialCardAnimation";
import { DelayedLoading } from "../../components/DelayedLoading";
import { useCardAnimations } from "../../providers/CardAnimationsProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { PracticeContent } from "./PracticeContent";

export const PracticePage = () => {
  const { animateSecondChanceCard, animateSpecialCardDefault } =
    useCardAnimations();
  const { isSmallScreen } = useResponsiveValues();

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
      <PracticeContent />
      <RemoveScroll>
        <></>
      </RemoveScroll>
    </DelayedLoading>
  );
};
