import { SEASON_NUMBER } from "../constants/season";
import type { SimplifiedCard } from "../pages/ExternalPack/ExternalPack";

const DEFAULT_API_BASE_URL = "http://localhost:3001";
const DEFAULT_SEASON_ID = Number(SEASON_NUMBER ?? 1) || 1;

export type ClaimSeasonRewardParams = {
  address: string;
  level: number;
  isPremium: boolean;
  seasonId?: number;
};

type RawMintedCard = {
  recipient: string;
  pack_id: number;
  card_id: number;
  marketable: boolean;
  skin_id: number;
  pack_number: number;
};

type ClaimSeasonRewardApiResponse = {
  success?: boolean;
  transactionHash?: string;
  mintedCards?: RawMintedCard[];
};

export type SeasonRewardPack = {
  packId: number;
  packNumber: number;
  mintedCards: SimplifiedCard[];
};

export type ClaimSeasonRewardResult = {
  transactionHash: string;
  packs: SeasonRewardPack[];
};

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "claim rewards: Missing VITE_GAME_API_KEY environment variable"
    );
  }
  return apiKey;
}

function parseMintedCards(
  mintedCards: RawMintedCard[] | undefined,
  context: string
): SeasonRewardPack[] {
  if (!Array.isArray(mintedCards) || mintedCards.length === 0) {
    throw new Error(`${context}: No minted cards returned by API`);
  }

  const packsMap = mintedCards.reduce<Map<number, SeasonRewardPack>>(
    (acc, card) => {
      const packNumber = Number.isFinite(card.pack_number)
        ? card.pack_number
        : undefined;
      const packId = Number.isFinite(card.pack_id) ? card.pack_id : undefined;
      const resolvedPackNumber = packNumber ?? packId;

      if (resolvedPackNumber === undefined) {
        return acc;
      }

      if (!Number.isFinite(card.card_id) || !Number.isFinite(card.skin_id)) {
        return acc;
      }

      const simplifiedCard: SimplifiedCard = {
        card_id: card.card_id,
        skin_id: card.skin_id,
      };

      const existing = acc.get(resolvedPackNumber);
      if (existing) {
        existing.mintedCards.push(simplifiedCard);
        if (packId !== undefined) {
          existing.packId = packId;
        }
      } else {
        acc.set(resolvedPackNumber, {
          packId: packId ?? resolvedPackNumber,
          packNumber: resolvedPackNumber,
          mintedCards: [simplifiedCard],
        });
      }

      return acc;
    },
    new Map()
  );

  if (packsMap.size === 0) {
    throw new Error(`${context}: No valid packs returned by API`);
  }

  return Array.from(packsMap.values());
}

export async function claimSeasonReward({
  address,
  level,
  isPremium,
  seasonId = DEFAULT_SEASON_ID,
}: ClaimSeasonRewardParams): Promise<SeasonRewardPack[] | boolean> {
  if (!address) {
    throw new Error("claimSeasonReward: address is required");
  }

  if (!Number.isFinite(level)) {
    throw new Error("claimSeasonReward: level must be a finite number");
  }

  if (!Number.isFinite(seasonId)) {
    throw new Error("claimSeasonReward: seasonId must be a finite number");
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/season/claim-rewards`;
  const apiKey = getApiKey();

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      address,
      season_id: seasonId,
      level,
      is_premium: isPremium,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `claimSeasonReward: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: ClaimSeasonRewardApiResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "claimSeasonReward: API responded without success flag set to true"
    );
  }

  return json.mintedCards?.length ? parseMintedCards(json.mintedCards, "claimSeasonReward") : true;
}

export type ClaimUnclaimedRewardsParams = {
  address: string;
};

export async function claimUnclaimedRewards({
  address,
}: ClaimUnclaimedRewardsParams): Promise<SeasonRewardPack[]> {
  if (!address) {
    throw new Error("claimUnclaimedRewards: address is required");
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/profile/claim-packs`;
  const apiKey = getApiKey();

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      address,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `claimUnclaimedRewards: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: ClaimSeasonRewardApiResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "claimUnclaimedRewards: API responded without success flag set to true"
    );
  }

  return parseMintedCards(json.mintedCards, "claimUnclaimedRewards");
}
