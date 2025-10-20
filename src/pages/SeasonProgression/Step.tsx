import { Flex } from "@chakra-ui/react";
import { BLUE } from "../../theme/colors";
import { IStep } from "./types";

export const STEP_HEIGHT = 130;

interface StepProps {
  step: IStep;
}

export const Step = ({ step }: StepProps) => {
  return (
    <Flex h={`${STEP_HEIGHT}px`} w="100%" borderBottom={`1px solid ${BLUE}`}></Flex>
  );
};
