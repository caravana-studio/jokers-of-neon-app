import { Flex } from "@chakra-ui/react";
import { BLUE_RGBA, VIOLET_RGBA } from "../../theme/colors";
import { STEPS } from "./mocks";
import { Step, STEP_HEIGHT } from "./Step";
import { IStep } from "./types";
import { VerticalProgressBar } from "./VerticalProgressBar";

const CURRENT_XP = 80;

const getPxForStepNumber = (stepNumber: number): number => {
  return stepNumber * STEP_HEIGHT - STEP_HEIGHT / 2;
};
function calculateProgress(STEPS: IStep[], CURRENT_XP: number): number {
  for (let i = 0; i < STEPS.length; i++) {
    if (STEPS[i].xp === CURRENT_XP) {
      return getPxForStepNumber(i + 1);
    } else if (STEPS[i].xp > CURRENT_XP) {
      const previousXp = STEPS[i - 1]?.xp ?? 0;
      const currentXp = STEPS[i].xp;
      const difference =
        ((CURRENT_XP - previousXp) / (currentXp - previousXp)) * STEP_HEIGHT;
      return getPxForStepNumber(i) + difference;
    }
  }
  return 0;
}

export const SeasonProgressionContent = () => {
  return (
    <Flex w="100%" marginTop="120px" position="relative" overflowY="auto">
      <Flex position="absolute" w="100%" flexDir={"column"}  pb="100px">
        {STEPS.map((step, index) => {
          return <Step key={index} step={step} />;
        })}
      </Flex>
      <Flex position="absolute" w="100%" h={`${STEPS.length * STEP_HEIGHT}px`}>
        <Flex w="50%" h="100%" bgColor={BLUE_RGBA(0.2)}></Flex>
        <Flex h="100%">
          <VerticalProgressBar
            progress={calculateProgress(STEPS, CURRENT_XP)}
            steps={STEPS}
            currentXp={CURRENT_XP}
          />
        </Flex>
        <Flex w="50%" h="100%" bgColor={VIOLET_RGBA(0.3)}></Flex>
      </Flex>
    </Flex>
  );
};
