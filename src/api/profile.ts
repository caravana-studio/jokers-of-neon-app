const DEFAULT_API_BASE_URL = "http://localhost:3001";

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

function getBaseUrl(): string {
  return (
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL
  );
}

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error("profileApi: Missing VITE_GAME_API_KEY environment variable");
  }
  return apiKey;
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
  const requestUrl = `${baseUrl}/api/profile/stats/${encodeURIComponent(
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

export async function createProfile(
  address: string,
  username: string,
  avatarId: number
): Promise<CreateProfileApiResponse> {
  if (!address) {
    throw new Error("createProfile: address is required");
  }

  if (!username) {
    throw new Error("createProfile: username is required");
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
      username,
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
