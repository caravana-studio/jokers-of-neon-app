import { getGameApiBaseUrl } from "../config/gameApiUrl";
import {
  parseMintedCards,
  type RawMintedCard,
  type SeasonRewardPack,
} from "./claimSeasonReward";
import { normalizeStarknetAddress } from "../utils/starknetAddress";

type GetProfileApiResponse = {
  success?: boolean;
  data?: {
    address?: string;
    username?: string | null;
    total_xp?: string | number | null;
    xp?: string | number | null;
    level?: string | number | null;
    available_games?: string | number | null;
    max_available_games?: string | number | null;
    daily_streak?: string | number | null;
    banned?: boolean | null;
    badges_ids?: Array<string | number>;
    avatar_id?: string | number | null;
    claimable_packs?: Array<number>;
  };
};

type UpdateAvatarApiResponse = {
  success?: boolean;
  transactionHash?: string;
};

type GetProfileStatsApiResponse = {
  success?: boolean;
  data?: {
    address?: string;
    games_played?: string | number | null;
    games_won?: string | number | null;
    high_card_played?: string | number | null;
    pair_played?: string | number | null;
    two_pair_played?: string | number | null;
    three_of_a_kind_played?: string | number | null;
    four_of_a_kind_played?: string | number | null;
    five_of_a_kind_played?: string | number | null;
    full_house_played?: string | number | null;
    flush_played?: string | number | null;
    straight_played?: string | number | null;
    straight_flush_played?: string | number | null;
    royal_flush_played?: string | number | null;
    loot_boxes_purchased?: string | number | null;
    cards_purchased?: string | number | null;
    specials_purchased?: string | number | null;
    specials_sold?: string | number | null;
    power_ups_purchased?: string | number | null;
    level_ups_purchased?: string | number | null;
    modifiers_purchased?: string | number | null;
    rerolls_purchased?: string | number | null;
    burn_purchased?: string | number | null;
  };
};

type GetLevelConfigApiResponse = {
  success?: boolean;
  data?: {
    level?: string | number | null;
    xp_required?: string | number | null;
  };
};

type GetStreakStatusApiResponse = {
  success?: boolean;
  data?: {
    player?: string;
    current_streak?: string | number | null;
    effective_streak?: string | number | null;
    longest_streak?: string | number | null;
    last_completed_day?: string | number | null;
    protectors_available?: string | number | null;
    protectors_needed?: string | number | null;
    days_missed?: string | number | null;
    is_protected?: boolean | number | null;
    is_broken?: boolean | number | null;
    sync_status?: "confirmed" | "pending" | "failed" | null;
    pending_period_id?: string | number | null;
    source?: "cache" | "chain" | null;
    updated_at?: string | null;
    current_period_id?: string | number | null;
    completed_today?: boolean | number | null;
    currentPeriodId?: string | number | null;
    completedToday?: boolean | number | null;
  };
};

type ClaimStreakPresentationApiResponse = {
  success?: boolean;
  data?: {
    show?: boolean | null;
    streak?: string | number | null;
    period_id?: string | number | null;
    periodId?: string | number | null;
    reward?: RawStreakPresentationReward | null;
    reason?: StreakPresentationReason | null;
    acknowledged?: boolean | null;
    presentedAt?: string | null;
  };
  show?: boolean | null;
  streak?: string | number | null;
  period_id?: string | number | null;
  periodId?: string | number | null;
  reward?: RawStreakPresentationReward | null;
  reason?: StreakPresentationReason | null;
  acknowledged?: boolean | null;
  presentedAt?: string | null;
};

export type StreakPresentationReason =
  | "already_claimed"
  | "missing_username"
  | "not_completed_today"
  | "sync_pending"
  | "sync_failed"
  | "period_mismatch"
  | "table_missing"
  | "streak_unavailable";

type RawStreakRewardItem =
  | {
      type: "pack";
      tier?: "basic" | "advanced" | "epic" | "legendary" | "collector";
      packId?: string | number | null;
      pack_id?: string | number | null;
      quantity?: string | number | null;
      track?: "normal" | "recurring" | "bonus";
    }
  | {
      type: "xp";
      amount?: string | number | null;
      track?: "normal" | "recurring" | "bonus";
    }
  | {
      type: "streak_protector";
      quantity?: string | number | null;
      optional?: boolean;
      track?: "normal" | "recurring" | "bonus";
    };

type RawStreakPresentationReward = {
  claimIds?: string[];
  claim_ids?: string[];
  milestone?: string | number | null;
  items?: RawStreakRewardItem[];
};

type ClaimStreakRewardsApiResponse = {
  success?: boolean;
  error?: string;
  code?: string;
  mintedCards?: RawMintedCard[];
  xp?: {
    requested?: number;
    queued?: number;
    transactionId?: string;
  };
  streakProtectors?: {
    requested?: number;
    queued?: number;
    skipped?: number;
    protectorsAvailable?: number;
    maxProtectors?: number;
    availableSlots?: number;
  };
  transactionIds?: string[];
  alreadyClaimed?: boolean;
};

type CreateProfileApiResponse = {
  success?: boolean;
  transactionHash?: string;
};

export type ProfileApiData = {
  address: string;
  username: string;
  totalXp: number;
  currentXp: number;
  level: number;
  availableGames: number;
  maxAvailableGames: number;
  dailyStreak: number;
  banned: boolean;
  badgesIds: number[];
  avatarId: number;
  claimablePacks: number[];
};

export type ProfileStatsApiData = {
  address: string;
  gamesPlayed: number;
  gamesWon: number;
  highCardPlayed: number;
  pairPlayed: number;
  twoPairPlayed: number;
  threeOfAKindPlayed: number;
  fourOfAKindPlayed: number;
  fiveOfAKindPlayed: number;
  fullHousePlayed: number;
  flushPlayed: number;
  straightPlayed: number;
  straightFlushPlayed: number;
  royalFlushPlayed: number;
  lootBoxesPurchased: number;
  cardsPurchased: number;
  specialsPurchased: number;
  specialsSold: number;
  powerUpsPurchased: number;
  levelUpsPurchased: number;
  modifiersPurchased: number;
  rerollsPurchased: number;
  burnPurchased: number;
};

export type ProfileLevelConfigApiData = {
  level: number;
  xpRequired: number;
};

export type StreakStatusApiData = {
  player: string;
  currentStreak: number;
  effectiveStreak: number;
  longestStreak: number;
  lastCompletedDay: number;
  protectorsAvailable: number;
  protectorsNeeded: number;
  daysMissed: number;
  isProtected: boolean;
  isBroken: boolean;
  syncStatus: "confirmed" | "pending" | "failed";
  pendingPeriodId: number | null;
  source: "cache" | "chain";
  updatedAt: string | null;
  currentPeriodId: number;
  completedToday: boolean;
};

export type StreakPresentationClaimApiData = {
  show: boolean;
  streak: number | null;
  periodId: number | null;
  reward: StreakPresentationRewardApiData | null;
  reason: StreakPresentationReason | null;
  acknowledged: boolean;
};

export type StreakRewardTrack = "normal" | "recurring" | "bonus";
export type StreakRewardItemApiData =
  | {
      type: "pack";
      tier: "basic" | "advanced" | "epic" | "legendary" | "collector";
      packId: number;
      quantity: number;
      track: StreakRewardTrack;
    }
  | {
      type: "xp";
      amount: number;
      track: StreakRewardTrack;
    }
  | {
      type: "streak_protector";
      quantity: number;
      optional: boolean;
      track: StreakRewardTrack;
    };

export type StreakPresentationRewardApiData = {
  claimIds: string[];
  milestone: number;
  items: StreakRewardItemApiData[];
};

function parseStreakPresentationResponse(
  json: ClaimStreakPresentationApiResponse
): StreakPresentationClaimApiData {
  const data = json.data ?? json;

  if (typeof data.show !== "boolean") {
    throw new Error("Streak presentation API did not return a valid payload");
  }

  const rawPeriodId = data.period_id ?? data.periodId;

  return {
    show: data.show,
    streak:
      data.streak === null || data.streak === undefined
        ? null
        : sanitizeNumber(data.streak),
    periodId:
      rawPeriodId === null || rawPeriodId === undefined
        ? null
        : sanitizeNumber(rawPeriodId),
    reward: parseStreakPresentationReward(data.reward),
    reason: data.reason ?? null,
    acknowledged: Boolean(data.acknowledged),
  };
}

export type ClaimStreakRewardsResult = {
  packs: SeasonRewardPack[];
  xp: {
    requested: number;
    queued: number;
    transactionId?: string;
  };
  streakProtectors: {
    requested: number;
    queued: number;
    skipped: number;
    protectorsAvailable?: number;
    maxProtectors?: number;
    availableSlots?: number;
  };
  transactionIds: string[];
  alreadyClaimed: boolean;
};

function getBaseUrl(): string {
  return getGameApiBaseUrl();
}

function getProfileStatsBlockchain(): string {
  return import.meta.env.VITE_BLOCKCHAIN?.trim() || "starknet";
}

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("profileApi: Missing VITE_GAME_API_KEY environment variable");
  }
  return apiKey;
}

function normalizeRewardTrack(track: unknown): StreakRewardTrack {
  return track === "recurring" || track === "bonus" ? track : "normal";
}

function parseStreakRewardItem(item: RawStreakRewardItem): StreakRewardItemApiData | null {
  if (item.type === "pack") {
    const packId = sanitizeNumber(item.packId ?? item.pack_id);
    if (!packId) {
      return null;
    }

    return {
      type: "pack",
      tier: item.tier ?? "basic",
      packId,
      quantity: Math.max(1, sanitizeNumber(item.quantity ?? 1)),
      track: normalizeRewardTrack(item.track),
    };
  }

  if (item.type === "xp") {
    return {
      type: "xp",
      amount: Math.max(0, sanitizeNumber(item.amount)),
      track: normalizeRewardTrack(item.track),
    };
  }

  if (item.type === "streak_protector") {
    return {
      type: "streak_protector",
      quantity: Math.max(1, sanitizeNumber(item.quantity ?? 1)),
      optional: Boolean(item.optional ?? true),
      track: normalizeRewardTrack(item.track),
    };
  }

  return null;
}

function parseStreakPresentationReward(
  reward: RawStreakPresentationReward | null | undefined
): StreakPresentationRewardApiData | null {
  if (!reward) {
    return null;
  }

  const claimIds = reward.claimIds ?? reward.claim_ids ?? [];
  const items = Array.isArray(reward.items)
    ? reward.items.map(parseStreakRewardItem).filter((item): item is StreakRewardItemApiData => Boolean(item))
    : [];

  if (!Array.isArray(claimIds) || claimIds.length === 0 || items.length === 0) {
    return null;
  }

  return {
    claimIds: claimIds.filter(Boolean),
    milestone: sanitizeNumber(reward.milestone),
    items,
  };
}

export async function fetchProfile(address: string): Promise<ProfileApiData> {
  if (!address) {
    throw new Error("fetchProfile: address is required");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = `${baseUrl}/api/profile/${encodeURIComponent(address)}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `fetchProfile: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: GetProfileApiResponse = await response.json();

  if (!json.success || !json.data) {
    throw new Error("fetchProfile: API did not return a valid profile payload");
  }

  const {
    address: playerAddress = "",
    username = "",
    total_xp,
    xp,
    level,
    available_games,
    max_available_games,
    daily_streak,
    banned,
    badges_ids,
    avatar_id,
    claimable_packs,
  } = json.data;

  return {
    address: playerAddress,
    username: username ?? "",
    totalXp: Number(total_xp ?? 0),
    currentXp: Number(xp ?? 0),
    level: Number(level ?? 0),
    availableGames: Number(available_games ?? 0),
    maxAvailableGames: Number(max_available_games ?? 0),
    dailyStreak: Number(daily_streak ?? 0),
    banned: Boolean(banned),
    badgesIds: Array.isArray(badges_ids)
      ? badges_ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id))
      : [],
    avatarId: Number(avatar_id ?? 0),
    claimablePacks: Array.isArray(claimable_packs)
      ? claimable_packs
          .map((packId) => Number(packId))
          .filter((packId) => !Number.isNaN(packId))
      : [],
  };
}

export async function updateProfileAvatar(
  address: string,
  avatarId: number
): Promise<UpdateAvatarApiResponse> {
  if (!address) {
    throw new Error("updateProfileAvatar: address is required");
  }

  if (Number.isNaN(Number(avatarId))) {
    throw new Error("updateProfileAvatar: avatarId must be a number");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = `${baseUrl}/api/profile/avatar`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      player_address: address,
      avatar_id: avatarId,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `updateProfileAvatar: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: UpdateAvatarApiResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "updateProfileAvatar: API responded without success flag set to true"
    );
  }

  return json;
}

function sanitizeNumber(value: string | number | null | undefined): number {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export async function fetchProfileStats(
  address: string
): Promise<ProfileStatsApiData> {
  if (!address) {
    throw new Error("fetchProfileStats: address is required");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = new URL(
    `${baseUrl}/api/profile/stats/${encodeURIComponent(address)}`
  );
  requestUrl.searchParams.set("blockchain", getProfileStatsBlockchain());

  const response = await fetch(requestUrl.toString(), {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `fetchProfileStats: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: GetProfileStatsApiResponse = await response.json();

  if (!json.success || !json.data) {
    throw new Error("fetchProfileStats: API did not return a valid payload");
  }

  const data = json.data;

  return {
    address: data.address ?? "",
    gamesPlayed: sanitizeNumber(data.games_played),
    gamesWon: sanitizeNumber(data.games_won),
    highCardPlayed: sanitizeNumber(data.high_card_played),
    pairPlayed: sanitizeNumber(data.pair_played),
    twoPairPlayed: sanitizeNumber(data.two_pair_played),
    threeOfAKindPlayed: sanitizeNumber(data.three_of_a_kind_played),
    fourOfAKindPlayed: sanitizeNumber(data.four_of_a_kind_played),
    fiveOfAKindPlayed: sanitizeNumber(data.five_of_a_kind_played),
    fullHousePlayed: sanitizeNumber(data.full_house_played),
    flushPlayed: sanitizeNumber(data.flush_played),
    straightPlayed: sanitizeNumber(data.straight_played),
    straightFlushPlayed: sanitizeNumber(data.straight_flush_played),
    royalFlushPlayed: sanitizeNumber(data.royal_flush_played),
    lootBoxesPurchased: sanitizeNumber(data.loot_boxes_purchased),
    cardsPurchased: sanitizeNumber(data.cards_purchased),
    specialsPurchased: sanitizeNumber(data.specials_purchased),
    specialsSold: sanitizeNumber(data.specials_sold),
    powerUpsPurchased: sanitizeNumber(data.power_ups_purchased),
    levelUpsPurchased: sanitizeNumber(data.level_ups_purchased),
    modifiersPurchased: sanitizeNumber(data.modifiers_purchased),
    rerollsPurchased: sanitizeNumber(data.rerolls_purchased),
    burnPurchased: sanitizeNumber(data.burn_purchased),
  };
}

export async function fetchProfileLevelConfigByAddress(
  address: string
): Promise<ProfileLevelConfigApiData> {
  if (!address) {
    throw new Error("fetchProfileLevelConfigByAddress: address is required");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = `${baseUrl}/api/profile/level-config/address/${encodeURIComponent(
    address
  )}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `fetchProfileLevelConfigByAddress: ${response.status} ${
        response.statusText
      }${errorDetails ? ` - ${errorDetails}` : ""}`
    );
  }

  const json: GetLevelConfigApiResponse = await response.json();

  if (!json.success || !json.data) {
    throw new Error(
      "fetchProfileLevelConfigByAddress: API did not return a valid payload"
    );
  }

  const data = json.data;

  return {
    level: sanitizeNumber(data.level),
    xpRequired: sanitizeNumber(data.xp_required),
  };
}

export async function fetchProfileLevelConfigByLevel(
  level: number
): Promise<ProfileLevelConfigApiData> {
  if (Number.isNaN(Number(level))) {
    throw new Error("fetchProfileLevelConfigByLevel: level must be a number");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = `${baseUrl}/api/profile/level-config/${encodeURIComponent(
    level
  )}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `fetchProfileLevelConfigByLevel: ${response.status} ${
        response.statusText
      }${errorDetails ? ` - ${errorDetails}` : ""}`
    );
  }

  const json: GetLevelConfigApiResponse = await response.json();

  if (!json.success || !json.data) {
    throw new Error(
      "fetchProfileLevelConfigByLevel: API did not return a valid payload"
    );
  }

  const data = json.data;

  return {
    level: sanitizeNumber(data.level),
    xpRequired: sanitizeNumber(data.xp_required),
  };
}

export async function fetchStreakStatus(
  address: string,
  options: { refresh?: boolean } = {}
): Promise<StreakStatusApiData> {
  if (!address) {
    throw new Error("fetchStreakStatus: address is required");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = new URL(
    `${baseUrl}/api/profile/streak/${encodeURIComponent(address)}`
  );

  if (options.refresh) {
    requestUrl.searchParams.set("refresh", "1");
  }

  const response = await fetch(requestUrl.toString(), {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `fetchStreakStatus: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: GetStreakStatusApiResponse = await response.json();

  if (!json.success || !json.data) {
    throw new Error("fetchStreakStatus: API did not return a valid payload");
  }

  const data = json.data;

  const streakStatus = {
    player: data.player ?? address,
    currentStreak: sanitizeNumber(data.current_streak),
    effectiveStreak: sanitizeNumber(data.effective_streak ?? data.current_streak),
    longestStreak: sanitizeNumber(data.longest_streak),
    lastCompletedDay: sanitizeNumber(data.last_completed_day),
    protectorsAvailable: sanitizeNumber(data.protectors_available),
    protectorsNeeded: sanitizeNumber(data.protectors_needed),
    daysMissed: sanitizeNumber(data.days_missed),
    isProtected: Boolean(data.is_protected),
    isBroken: Boolean(data.is_broken),
    syncStatus: data.sync_status ?? "confirmed",
    pendingPeriodId:
      data.pending_period_id === null || data.pending_period_id === undefined
        ? null
        : sanitizeNumber(data.pending_period_id),
    source: data.source ?? "chain",
    updatedAt: data.updated_at ?? null,
    currentPeriodId: sanitizeNumber(
      data.currentPeriodId ?? data.current_period_id
    ),
    completedToday: Boolean(
      data.completedToday ?? data.completed_today
    ),
  };

  return streakStatus;
}

export async function claimStreakPresentation(
  address: string
): Promise<StreakPresentationClaimApiData> {
  if (!address) {
    throw new Error("claimStreakPresentation: address is required");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = `${baseUrl}/api/profile/streak/${encodeURIComponent(
    address
  )}/presentation/claim`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `claimStreakPresentation: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  return parseStreakPresentationResponse(await response.json());
}

export async function fetchStreakPresentation(
  address: string
): Promise<StreakPresentationClaimApiData> {
  if (!address) {
    throw new Error("fetchStreakPresentation: address is required");
  }

  const response = await fetch(
    `${getBaseUrl()}/api/profile/streak/${encodeURIComponent(address)}/presentation`,
    {
      method: "GET",
      headers: { "X-API-Key": getApiKey() },
    }
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `fetchStreakPresentation: ${response.status} ${response.statusText}${
        details ? ` - ${details}` : ""
      }`
    );
  }

  return parseStreakPresentationResponse(await response.json());
}

export async function acknowledgeStreakPresentation(
  address: string,
  periodId: number
): Promise<StreakPresentationClaimApiData> {
  if (!address || !Number.isInteger(periodId) || periodId <= 0) {
    throw new Error(
      "acknowledgeStreakPresentation: address and periodId are required"
    );
  }

  const response = await fetch(
    `${getBaseUrl()}/api/profile/streak/${encodeURIComponent(address)}/presentation/ack`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": getApiKey(),
      },
      body: JSON.stringify({ periodId }),
    }
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `acknowledgeStreakPresentation: ${response.status} ${response.statusText}${
        details ? ` - ${details}` : ""
      }`
    );
  }

  return parseStreakPresentationResponse(await response.json());
}

export async function claimStreakRewards(
  address: string,
  claimIds: string[]
): Promise<ClaimStreakRewardsResult> {
  if (!address) {
    throw new Error("claimStreakRewards: address is required");
  }

  if (!Array.isArray(claimIds) || claimIds.length === 0) {
    throw new Error("claimStreakRewards: claimIds is required");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = `${baseUrl}/api/profile/streak/${encodeURIComponent(
    address
  )}/rewards/claim`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({ claimIds }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `claimStreakRewards: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: ClaimStreakRewardsApiResponse = await response.json();
  if (!json.success) {
    throw new Error(json.error ?? "claimStreakRewards: API did not return success");
  }

  return {
    packs: json.mintedCards?.length
      ? parseMintedCards(json.mintedCards, "claimStreakRewards")
      : [],
    xp: {
      requested: sanitizeNumber(json.xp?.requested ?? 0),
      queued: sanitizeNumber(json.xp?.queued ?? 0),
      transactionId: json.xp?.transactionId,
    },
    streakProtectors: {
      requested: sanitizeNumber(json.streakProtectors?.requested ?? 0),
      queued: sanitizeNumber(json.streakProtectors?.queued ?? 0),
      skipped: sanitizeNumber(json.streakProtectors?.skipped ?? 0),
      protectorsAvailable:
        json.streakProtectors?.protectorsAvailable === undefined
          ? undefined
          : sanitizeNumber(json.streakProtectors.protectorsAvailable),
      maxProtectors:
        json.streakProtectors?.maxProtectors === undefined
          ? undefined
          : sanitizeNumber(json.streakProtectors.maxProtectors),
      availableSlots:
        json.streakProtectors?.availableSlots === undefined
          ? undefined
          : sanitizeNumber(json.streakProtectors.availableSlots),
    },
    transactionIds: json.transactionIds ?? [],
    alreadyClaimed: Boolean(json.alreadyClaimed),
  };
}

export async function createProfile(
  address: string,
  avatarId: number
): Promise<CreateProfileApiResponse> {
  if (!address) {
    throw new Error("createProfile: address is required");
  }

  if (Number.isNaN(Number(avatarId))) {
    throw new Error("createProfile: avatarId must be a number");
  }

  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const requestUrl = `${baseUrl}/api/profile/create`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      address,
      avatar_id: avatarId,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `createProfile: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: CreateProfileApiResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "createProfile: API responded without success flag set to true"
    );
  }

  return json;
}

export function profileShouldBeCreated(
  profile: ProfileApiData,
  address: string
): boolean {
  const profileLooksEmpty =
    profile.avatarId <= 0 &&
    profile.maxAvailableGames <= 0 &&
    profile.totalXp <= 0 &&
    profile.currentXp <= 0;

  return (
    normalizeStarknetAddress(profile.address) !==
      normalizeStarknetAddress(address) ||
    profileLooksEmpty
  );
}

export async function fetchOrCreateProfile(
  address: string,
  fallbackAvatarId = 1
): Promise<ProfileApiData> {
  let profile = await fetchProfile(address);

  if (profileShouldBeCreated(profile, address)) {
    const avatarId =
      profile.avatarId > 0 ? Math.trunc(profile.avatarId) : fallbackAvatarId;
    await createProfile(address, avatarId);
    profile = await fetchProfile(address);
  }

  return profile;
}
