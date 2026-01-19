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
  refetch: () => void;
}

export const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ step, refetch }, ref) => {
    return (
      <Flex ref={ref} h={`${STEP_HEIGHT}px`} w="100%" borderBottom={`1px solid ${BLUE}`}>
        <StepIcons step={step} />
        <StepReward reward={step.free} type="free" level={step.level} refetch={refetch} />
        <StepReward reward={step.premium} type="premium" level={step.level} refetch={refetch} />
      </Flex>
    );
  }
);

Step.displayName = "Step";
