import type { Collection } from "../pages/MyCollection/types";
import {
  fillCollections,
  fillTraditionalCollection,
} from "../pages/MyCollection/utils";
import { transformAPIResultToCollection } from "../utils/transformers/transformAPIResultToCollection";
import { transformAPIResultToTraditionalCollection } from "../utils/transformers/transformAPIResultToTraditionalCollection";

const DEFAULT_API_BASE_URL = "http://localhost:3001";

export type UserCard = {
  tokenId: string;
  marketable: boolean;
  cardId: number;
  rarity: number;
  count: number;
  owner: string;
  skinId: number;
  skinRarity: number;
  quality: number;
};

type GetUserCardsApiResponse = {
  success?: boolean;
  data?: Array<{
    token_id: string;
    marketable: boolean;
    card_id: number;
    rarity: number;
    count: number;
    owner: string;
    skin_id: number;
    skin_rarity: number;
    quality: number;
  }>;
};

export async function getUserCards(userAddress: string): Promise<{
  specials: Collection[];
  traditionals: Collection;
  neons: Collection;
  ownedCardIds: number[];
}> {
  if (!userAddress) {
    throw new Error("getUserCards: userAddress is required");
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "getUserCards: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/nft/${encodeURIComponent(userAddress)}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `getUserCards: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: GetUserCardsApiResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "getUserCards: API responded without success flag set to true"
    );
  }

  if (!Array.isArray(json.data)) {
    throw new Error("getUserCards: API did not return a valid cards array");
  }

  const userCards: UserCard[] = json.data.map((entry) => ({
    tokenId: entry.token_id,
    marketable: Boolean(entry.marketable),
    cardId: Number(entry.card_id),
    rarity: Number(entry.rarity),
    count: Number(entry.count),
    owner: entry.owner,
    skinId: Number(entry.skin_id),
    skinRarity: Number(entry.skin_rarity),
    quality: Number(entry.quality),
  }));

  const ownedCardIds = Array.from(
    new Set(
      userCards
        .filter((card) => Number(card.count) > 0)
        .map((card) => card.cardId)
    )
  );

  return {
    specials: fillCollections(
      transformAPIResultToCollection(
        userCards.filter((card) => card.cardId >= 10100)
      )
    ),
    traditionals: {
      id: -1,
      cards: fillTraditionalCollection(
        transformAPIResultToTraditionalCollection(
          userCards.filter((card) => card.cardId >= 0 && card.cardId <= 52)
        ),
        0,
        52
      ),
    },
    neons: {
      id: -2,
      cards: fillTraditionalCollection(
        transformAPIResultToTraditionalCollection(
          userCards.filter((card) => card.cardId >= 200 && card.cardId <= 252)
        ),
        200,
        252
      ),
    },
    ownedCardIds,
  };
}
