import { Flex } from "@chakra-ui/react";
import { BLUE } from "../../theme/colors";
import { StepIcons } from "./StepIcons";
import { StepReward } from "./StepReward";
import { IStep } from "./types";
import { isMobile } from "react-device-detect";

export const STEP_HEIGHT = isMobile ? 130 : 200;

export interface StepProps {
  step: IStep;
}

export const Step = ({ step }: StepProps) => {
  return (
    <Flex h={`${STEP_HEIGHT}px`} w="100%" borderBottom={`1px solid ${BLUE}`}>
      <StepIcons step={step} />
      <StepReward reward={step.free} />
      <StepReward reward={step.premium} />
    </Flex>
  );
};
