import { PackType } from "../../enums/packTypes";
import { RewardStatus } from "../../enums/rewardStatus";

export interface IStep {
  xp: number;
  free?: IReward;
  premium?: IReward;
  level: number;
}

export interface IReward {
  packs: PackType[];
  tournamentEntries: number;
  status: RewardStatus;
}
