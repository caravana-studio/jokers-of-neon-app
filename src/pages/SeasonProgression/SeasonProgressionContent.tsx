import { Flex } from "@chakra-ui/react";
import { BLUE_RGBA, VIOLET_RGBA } from "../../theme/colors";
import { Step, STEP_HEIGHT } from "./Step";
import { IStep } from "./types";
import { VerticalProgressBar } from "./VerticalProgressBar";


const getPxForStepNumber = (stepNumber: number): number => {
  return stepNumber * STEP_HEIGHT - STEP_HEIGHT / 2;
};
function calculateProgress(steps: IStep[], playerProgress: number): number {
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].xp === playerProgress) {
      return getPxForStepNumber(i + 1);
    } else if (steps[i].xp > playerProgress) {
      const previousXp = steps[i - 1]?.xp ?? 0;
      const currentXp = steps[i].xp;
      const difference =
        ((playerProgress - previousXp) / (currentXp - previousXp)) * STEP_HEIGHT;
      return getPxForStepNumber(i) + difference;
    }
  }
  return 0;
}

interface SeasonProgressionContentProps {
  steps: IStep[];
  playerProgress: number;
}

export const SeasonProgressionContent = ({
  steps,
  playerProgress,
}: SeasonProgressionContentProps) => {
  return (
    <Flex w="100%" marginTop={`${STEP_HEIGHT}px`} position="relative" overflowY="auto">
      <Flex position="absolute" w="100%" flexDir={"column"}  pb="100px">
        {steps.map((step, index) => {
          return <Step key={index} step={step} />;
        })}
      </Flex>
      <Flex position="absolute" w="100%" h={`${steps.length * STEP_HEIGHT}px`}>
        <Flex w="50%" h="100%" bgColor={BLUE_RGBA(0.2)}></Flex>
        <Flex h="100%">
          <VerticalProgressBar
            progress={calculateProgress(steps, playerProgress)}
            steps={steps}
            currentXp={playerProgress}
          />
        </Flex>
        <Flex w="50%" h="100%" bgColor={VIOLET_RGBA(0.3)}></Flex>
      </Flex>
    </Flex>
  );
};
