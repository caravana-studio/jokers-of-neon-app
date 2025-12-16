import { Flex } from "@chakra-ui/react";
import { BLUE_RGBA, VIOLET_RGBA } from "../../theme/colors";
import { Step, STEP_HEIGHT } from "./Step";
import { IStep } from "./types";
import { VerticalProgressBar } from "./VerticalProgressBar";

const getPxForStepNumber = (stepNumber: number): number => {
  return stepNumber * STEP_HEIGHT - STEP_HEIGHT / 2;
};
function calculateProgress(steps: IStep[], playerProgress: number): number {
  if (playerProgress === 0) {
    return 0;
  }
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].xp === playerProgress) {
      return getPxForStepNumber(i + 1);
    } else if (steps[i].xp > playerProgress) {
      const previousXp = steps[i - 1]?.xp ?? 0;
      const currentXp = steps[i].xp;
      const difference =
        ((playerProgress - previousXp) / (currentXp - previousXp)) *
        STEP_HEIGHT;
      return getPxForStepNumber(i) + difference;
    }
  }
  return steps.length * STEP_HEIGHT;
}

interface SeasonProgressionContentProps {
  steps: IStep[];
  playerProgress: number;
  refetch: () => void;
}

export const SeasonProgressionContent = ({
  steps,
  playerProgress,
  refetch,
}: SeasonProgressionContentProps) => {
  return (
    <Flex
      w="100%"
      marginTop={`${STEP_HEIGHT}px`}
      position="relative"
      overflowY="auto"
    >
      <Flex position="absolute" w="100%" flexDir={"column"} pb="100px">
        {steps.map((step, index) => {
          return <Step key={index} step={step} refetch={refetch} />;
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
