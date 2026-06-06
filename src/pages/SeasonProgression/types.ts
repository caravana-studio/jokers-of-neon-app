import { RewardStatus } from "../../enums/rewardStatus";

export interface IStep {
  xp: number;
  free?: IReward;
  premium?: IReward;
  level: number;
}

export interface IReward {
  packs: number[];
  tournamentEntries: number;
  streakProtectors: number;
  status: RewardStatus;
}
