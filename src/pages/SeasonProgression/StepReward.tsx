import { Button, Flex } from "@chakra-ui/react";
import { faCheck, faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CachedImage from "../../components/CachedImage";
import { RewardStatus } from "../../enums/rewardStatus";
import { BLUE_LIGHT, VIOLET } from "../../theme/colors";
import { STEP_HEIGHT } from "./Step";
import { IReward } from "./types";
import { Packs } from "./Packs";

interface StepRewardProps {
  reward?: IReward;
}



export const StepReward = ({ reward }: StepRewardProps) => {
  const pack = reward?.packs?.[0];

  return (

    <Flex
      w="50%"
      justifyContent="center"
      alignItems="center"
      position="relative"
      opacity={reward?.status === RewardStatus.UNCLAIMED ? 1 : 0.5}
      >
      {pack && reward && (
          <>
          <Packs reward={reward} />

          {reward.status === RewardStatus.UNCLAIMED && (
              <Flex position={"absolute"} bottom={2} zIndex={4}>
              <Button
                size="xs"
                h={4}
                fontSize={6}
                boxShadow={`0 0 5px 2px ${VIOLET}`}
                variant="secondarySolid"
                >
                CLAIM
              </Button>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};
