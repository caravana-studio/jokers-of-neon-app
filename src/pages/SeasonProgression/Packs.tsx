import CachedImage from "../../components/CachedImage";
import { RewardStatus } from "../../enums/rewardStatus";
import { BLUE_LIGHT } from "../../theme/colors";
import { STEP_HEIGHT } from "./Step";
import { IReward } from "./types";

interface PacksProps {
  reward: IReward;
}

const getRotation = (index: number, amountOfPacks: number) => {
  if (amountOfPacks === 2) {
    return index === 0 ? "-10" : "10";
  } else if (amountOfPacks === 3) {
    return index === 0 ? "-15" : index === 1 ? "0" : "15";
  }
  return 0;
};
const getTranslation = (index: number, amountOfPacks: number) => {
  if (amountOfPacks === 2) {
    return index === 0 ? "-15" : "15";
  } else if (amountOfPacks === 3) {
    return index === 0 ? "-20" : index === 1 ? "0" : "20";
  }
  return 0;
};

export const Packs = ({ reward }: PacksProps) => {
  const amountOfPacks = reward.packs.length;
  return reward.packs.map((pack, index) => (
    <CachedImage
      zIndex={3}
      position="absolute"
      transform={`rotate(${getRotation(index, amountOfPacks)}deg) translateX(${getTranslation(index, amountOfPacks)}px)`}
      boxShadow={
        reward.status === RewardStatus.UNCLAIMED
          ? `0 0 15px 2px ${BLUE_LIGHT}, inset 0 0 10px 0px ${BLUE_LIGHT}`
          : "0 0 10px 0px rgba(255,255,255,0.5)"
      }
      src={`/packs/${pack}.png`}
      h={`${STEP_HEIGHT * 0.78}px`}
      opacity={reward.status === RewardStatus.UNCLAIMED ? 1 : 0.4}
    />
  ));
};
