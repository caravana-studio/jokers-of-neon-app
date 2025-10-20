import { PackType } from "../../enums/packTypes";
import { RewardStatus } from "../../enums/rewardStatus";
import { IStep } from "./types";

export const STEPS: IStep[] = [
  {
    xp: 25,
    free: {
      packs: [PackType.ADVANCED],
      status: RewardStatus.CLAIMED
    },
    premium: {
      packs: [PackType.EPIC],
      status: RewardStatus.MISSED
    },
  },
  {
    xp: 50,
    premium: {
      packs: [PackType.LEGENDARY],
      status: RewardStatus.MISSED
    },

  },
  {
    xp: 100,
    premium: {
      packs: [PackType.EPIC, PackType.ADVANCED],
      status: RewardStatus.LOCKED
    },
  },
  {
    xp: 250,
    free: {
      packs: [PackType.ADVANCED],
      status: RewardStatus.UPCOMING
    },
    premium: {
      packs: [PackType.EPIC],
      status: RewardStatus.LOCKED
    },
  },
  {
    xp: 500,
    premium: {
      packs: [PackType.LEGENDARY],
      status: RewardStatus.LOCKED
    },
  },
];