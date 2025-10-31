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
};

type ClaimSeasonRewardApiResponse = {
  success?: boolean;
  transactionHash?: string;
  mintedCards?: RawMintedCard[];
};

export type SeasonRewardPack = {
  packId: number;
  mintedCards: SimplifiedCard[];
};

export type ClaimSeasonRewardResult = {
  transactionHash: string;
  packs: SeasonRewardPack[];
};

export async function claimSeasonReward({
  address,
  level,
  isPremium,
  seasonId = DEFAULT_SEASON_ID,
}: ClaimSeasonRewardParams): Promise<SeasonRewardPack[]> {
  if (!address) {
    throw new Error("claimSeasonReward: address is required");
  }

  if (!Number.isFinite(level)) {
    throw new Error("claimSeasonReward: level must be a finite number");
  }

  if (!Number.isFinite(seasonId)) {
    throw new Error("claimSeasonReward: seasonId must be a finite number");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "claimSeasonReward: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/season/claim-rewards`;

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

  if (!json.transactionHash) {
    throw new Error(
      "claimSeasonReward: Missing transaction hash in API response"
    );
  }

  if (!Array.isArray(json.mintedCards) || json.mintedCards.length === 0) {
    throw new Error("claimSeasonReward: No minted cards returned by API");
  }

  const packsMap = json.mintedCards.reduce<Map<number, SimplifiedCard[]>>(
    (acc, card) => {
      if (!Number.isFinite(card.pack_id)) {
        return acc;
      }

      if (!Number.isFinite(card.card_id) || !Number.isFinite(card.skin_id)) {
        return acc;
      }

      const simplifiedCard: SimplifiedCard = {
        card_id: card.card_id,
        skin_id: card.skin_id,
      };

      const existing = acc.get(card.pack_id);
      if (existing) {
        existing.push(simplifiedCard);
      } else {
        acc.set(card.pack_id, [simplifiedCard]);
      }

      return acc;
    },
    new Map()
  );

  if (packsMap.size === 0) {
    throw new Error("claimSeasonReward: No valid packs returned by API");
  }

  const packs: SeasonRewardPack[] = Array.from(packsMap.entries())
    .map(([packId, cards]) => ({
      packId,
      mintedCards: cards.sort((a, b) => {
        if (a.skin_id !== b.skin_id) {
          return b.skin_id - a.skin_id;
        }
        return b.card_id - a.card_id;
      }),
    }))
    .sort((a, b) => a.packId - b.packId);

  return packs;
}
