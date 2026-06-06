import { getSeasonNumber } from "../constants/season";
import { getGameApiBaseUrl } from "../config/gameApiUrl";
import { RewardStatus } from "../enums/rewardStatus";
import { IReward, IStep } from "../pages/SeasonProgression/types";
const TOURNAMENT_ENTRY_PACK_ID = 99;
const STREAK_PROTECTOR_REWARD_ID = 100;

export type GetSeasonLineParams = {
  userAddress: string;
  seasonId?: number;
  limit?: number;
  forceSeasonPassUnlocked?: boolean;
};

type SeasonLineApiEntry = {
  level: number;
  required_xp: string;
  free_rewards: number[];
  premium_rewards: number[];
  free_claimed: boolean;
  premium_claimed: boolean;
};

type SeasonLineApiResponse = {
  data?: SeasonLineApiEntry[];
};

const getStatus = (
  claimed: boolean,
  level: number,
  seasonPassUnlocked: boolean,
  playerProgress: number,
  seasonPassUnlockedAtLevel: number,
  premium: boolean,
  requiredXp: number
): RewardStatus => {
  if (claimed) {
    return RewardStatus.CLAIMED;
  } else if (premium) {
    if (!seasonPassUnlocked) {
      return RewardStatus.LOCKED;
    } else if (level < seasonPassUnlockedAtLevel) {
      return RewardStatus.MISSED;
    }
  }

  if (playerProgress < requiredXp) {
    return RewardStatus.UPCOMING;
  }
  return RewardStatus.UNCLAIMED;
};

const parseReward = (
  level: number,
  rewards: number[],
  claimed: boolean,
  requiredXp: number,
  seasonPassUnlocked: boolean,
  playerProgress: number,
  seasonPassUnlockedAtLevel: number,
  premium: boolean
): IReward | undefined => {
  if (!rewards || rewards.length === 0) {
    return undefined;
  }

  const parsedRewards = rewards
    .map((packId) => Number(packId))
    .filter((packId) => Number.isFinite(packId));

  const tournamentEntries = parsedRewards.filter(
    (packId) => packId === TOURNAMENT_ENTRY_PACK_ID
  ).length;

  const streakProtectors = parsedRewards.filter(
    (packId) => packId === STREAK_PROTECTOR_REWARD_ID
  ).length;

  const packs = parsedRewards.filter(
    (packId) =>
      packId !== TOURNAMENT_ENTRY_PACK_ID &&
      packId !== STREAK_PROTECTOR_REWARD_ID &&
      packId > 0
  );

  if (packs.length === 0 && tournamentEntries === 0 && streakProtectors === 0) {
    return undefined;
  }

  return {
    packs,
    tournamentEntries,
    streakProtectors,
    status: getStatus(
      claimed,
      level,
      seasonPassUnlocked,
      playerProgress,
      seasonPassUnlockedAtLevel,
      premium,
      requiredXp
    ),
  };
};

const transformSeasonLine = (
  entries: SeasonLineApiEntry[],
  seasonPassUnlocked: boolean,
  playerProgress: number,
  seasonPassUnlockedAtLevel: number
): IStep[] => {
  return entries.map((entry) => {
    const xp = Number(entry.required_xp);
    const level = Number(entry.level);

    if (!Number.isFinite(xp)) {
      throw new Error(
        `getSeasonLine: Invalid required_xp value for level ${entry.level}`
      );
    }

    return {
      xp,
      free: parseReward(
        entry.level,
        entry.free_rewards,
        entry.free_claimed,
        xp,
        seasonPassUnlocked,
        playerProgress,
        seasonPassUnlockedAtLevel,
        false
      ),
      premium: parseReward(
        entry.level,
        entry.premium_rewards,
        entry.premium_claimed,
        xp,
        seasonPassUnlocked,
        playerProgress,
        seasonPassUnlockedAtLevel,
        true
      ),
      level,
    };
  });
};

const countUnclaimedRewards = (steps: IStep[]) =>
  steps.reduce((total, step) => {
    if (step.free?.status === RewardStatus.UNCLAIMED) {
      total += 1;
    }
    if (step.premium?.status === RewardStatus.UNCLAIMED) {
      total += 1;
    }
    return total;
  }, 0);

export async function getSeasonProgress({
  userAddress,
  seasonId = getSeasonNumber(),
  forceSeasonPassUnlocked,
}: GetSeasonLineParams): Promise<{
  steps: IStep[];
  seasonPassUnlocked: boolean;
  playerProgress: number;
  tournamentEntries: number;
  rewardsLeftToClaim: number[];
  unclaimedRewardsCount: number;
}> {
  if (!userAddress) {
    throw new Error("getSeasonLine: userAddress is required");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "getSeasonLine: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl = getGameApiBaseUrl();

  const progressRequestUrl = `${baseUrl}/api/season/progress/${encodeURIComponent(
    userAddress
  )}/${seasonId}`;

  const progressResponse = await fetch(progressRequestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  const progressJson = await progressResponse.json();

  const apiSeasonPassUnlocked = !!Number(
    progressJson?.data?.has_season_pass ?? 0
  );
  const seasonPassUnlocked =
    forceSeasonPassUnlocked === true ? true : apiSeasonPassUnlocked;
  const playerProgress = Number(progressJson?.data?.season_xp ?? 0);
  const seasonPassUnlockedAtLevel = seasonPassUnlocked
    ? Number(progressJson?.data?.season_pass_unlocked_at_level ?? 0)
    : 0;

  const tournamentEntries = Number(progressJson?.data?.ticket_amount ?? 0);
  const rewardsLeftToClaim = progressJson?.data?.claimable_rewards_id ??  [];

  const seasonLineRequestUrl = `${baseUrl}/api/season/line/${encodeURIComponent(
    userAddress
  )}/${seasonId}`;

  const seasonLineResponse = await fetch(seasonLineRequestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!progressResponse.ok) {
    const errorDetails = await progressResponse.text().catch(() => "");
    throw new Error(
      `getProgress: ${progressResponse.status} ${progressResponse.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  if (!seasonLineResponse.ok) {
    const errorDetails = await seasonLineResponse.text().catch(() => "");
    throw new Error(
      `getSeasonLine: ${seasonLineResponse.status} ${seasonLineResponse.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json = (await seasonLineResponse.json()) as SeasonLineApiResponse;

  if (!Array.isArray(json?.data)) {
    throw new Error("getSeasonLine: Unexpected API response shape");
  }

  const steps = transformSeasonLine(
    json.data,
    seasonPassUnlocked,
    playerProgress,
    seasonPassUnlockedAtLevel
  );
  const unclaimedRewardsCount = countUnclaimedRewards(steps);

  return {
    seasonPassUnlocked,
    playerProgress,
    tournamentEntries,
    rewardsLeftToClaim,
    unclaimedRewardsCount,
    steps,
  };
}
