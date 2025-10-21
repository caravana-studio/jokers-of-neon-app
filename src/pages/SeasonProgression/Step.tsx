import { Flex } from "@chakra-ui/react";
import { faCheck, faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RewardStatus } from "../../enums/rewardStatus";
import { BLUE } from "../../theme/colors";
import { StepReward } from "./StepReward";
import { IStep } from "./types";
import { StepIcons } from "./StepIcons";

export const STEP_HEIGHT = 130;

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
