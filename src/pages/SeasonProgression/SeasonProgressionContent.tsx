import { Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { BLUE_RGBA, VIOLET_RGBA } from "../../theme/colors";
import { RewardStatus } from "../../enums/rewardStatus";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAutoScrolled = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !steps.length || hasAutoScrolled.current) {
      return;
    }

    const timer = setTimeout(() => {
      const claimableIndex = steps.findIndex(
        (step) =>
          step.free?.status === RewardStatus.UNCLAIMED ||
          step.premium?.status === RewardStatus.UNCLAIMED
      );

      const xpIndex = steps.findIndex((step) => step.xp >= playerProgress);
      const targetIndex =
        claimableIndex !== -1
          ? claimableIndex
          : xpIndex !== -1
            ? xpIndex
            : steps.length - 1;

      const target = stepRefs.current[targetIndex];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        hasAutoScrolled.current = true;
        return;
      }

      const containerElement = containerRef.current;
      if (!containerElement) {
        return;
      }

      const approxTop =
        targetIndex * STEP_HEIGHT -
        containerElement.clientHeight / 2 +
        STEP_HEIGHT / 2;

      containerElement.scrollTo({
        top: Math.max(approxTop, 0),
        behavior: "smooth",
      });
      hasAutoScrolled.current = true;
    }, 300);

    return () => clearTimeout(timer);
  }, [steps, playerProgress]);

  stepRefs.current = [];

  return (
    <Flex
      ref={containerRef}
      w="100%"
      marginTop={`${STEP_HEIGHT}px`}
      position="relative"
      overflowY="auto"
    >
      <Flex position="absolute" w="100%" flexDir={"column"} pb="100px">
        {steps.map((step, index) => {
          return (
            <Step
              key={index}
              step={step}
              refetch={refetch}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
            />
          );
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
