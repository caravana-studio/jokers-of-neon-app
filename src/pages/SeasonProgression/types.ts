import { PackType } from "../../enums/packTypes";
import { RewardStatus } from "../../enums/rewardStatus";

export interface IStep {
  xp: number;
  free?: IReward;
  premium?: IReward;
}

export interface IReward {
  packs: PackType[];
  status: RewardStatus;
}
