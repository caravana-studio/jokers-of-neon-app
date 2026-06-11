import { Flex } from "@chakra-ui/react";
import { forwardRef } from "react";
import { BLUE } from "../../theme/colors";
import { StepIcons } from "./StepIcons";
import { StepReward } from "./StepReward";
import { IStep } from "./types";
import { isMobile } from "react-device-detect";

export const STEP_HEIGHT = isMobile ? 130 : 200;

export interface StepProps {
  step: IStep;
  streakProtectorsAvailable: number | null;
  maxStreakProtectors: number;
  refetch: () => void;
}

export const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ step, streakProtectorsAvailable, maxStreakProtectors, refetch }, ref) => {
    return (
      <Flex ref={ref} h={`${STEP_HEIGHT}px`} w="100%" borderBottom={`1px solid ${BLUE}`}>
        <StepIcons step={step} />
        <StepReward
          reward={step.free}
          type="free"
          level={step.level}
          streakProtectorsAvailable={streakProtectorsAvailable}
          maxStreakProtectors={maxStreakProtectors}
          refetch={refetch}
        />
        <StepReward
          reward={step.premium}
          type="premium"
          level={step.level}
          streakProtectorsAvailable={streakProtectorsAvailable}
          maxStreakProtectors={maxStreakProtectors}
          refetch={refetch}
        />
      </Flex>
    );
  }
);

Step.displayName = "Step";
