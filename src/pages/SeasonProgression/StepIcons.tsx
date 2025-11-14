import { Flex } from "@chakra-ui/react";
import { faCheck, faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RewardStatus } from "../../enums/rewardStatus";
import { STEP_HEIGHT } from "./Step";
import { IStep } from "./types";

const getIcon = (status?: RewardStatus) => {
  switch (status) {
    case RewardStatus.CLAIMED:
      return faCheck;
    case RewardStatus.MISSED:
      return faTimes;
    case RewardStatus.LOCKED:
      return faLock;
    default:
      return "";
  }
};

export interface StepIconsProps {
  step: IStep;
}

export const StepIcons = ({ step }: StepIconsProps) => {
  const freeIcon = getIcon(step.free?.status);
  const premiumIcon = getIcon(step.premium?.status);

  return (
    <Flex w="100%" h={`${STEP_HEIGHT}px`} position="absolute">
      <Flex w="50%" justifyContent="center" alignItems="center" h={"100%"}>
        {freeIcon && (
          <Flex position={"absolute"} zIndex={4}>
            <FontAwesomeIcon color="white" fontSize={25} icon={freeIcon} />
          </Flex>
        )}
      </Flex>
      <Flex w="50%" justifyContent="center" alignItems="center" h={"100%"}>
        {premiumIcon && (
          <Flex position={"absolute"} zIndex={4}>
            <FontAwesomeIcon color="white" fontSize={25} icon={premiumIcon} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
