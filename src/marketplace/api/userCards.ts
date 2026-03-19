import { hash } from "starknet";
import {
  GAME_API_URL,
  GAME_API_KEY,
  NFT_CONTRACT_ADDRESS,
  STARKNET_RPC_URL,
} from "../config/contracts";
import type { UserCard } from "../types/marketplace";

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

type TokenUriMetadata = {
  name?: string;
  image?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
};

type CardMetadata = { name: string; isSpecial: boolean; season: number };

// Cache by card_id — name and is_special are card-type properties, same for all tokens of the same card
const cardMetaCache: Record<number, CardMetadata> = {};

const TOKEN_URI_SELECTOR = hash.getSelectorFromName("token_uri");

/**
 * Fetch token_uri for a specific tokenId (NFT token ID, not card_id) and cache by cardId.
 */
async function fetchCardMeta(tokenId: string, cardId: number): Promise<CardMetadata> {
  if (cardMetaCache[cardId]) return cardMetaCache[cardId];
  const fallback: CardMetadata = { name: `Card #${cardId}`, isSpecial: false, season: 1 };
  if (!NFT_CONTRACT_ADDRESS) return fallback;

  try {
    // token_uri takes token_id as u256 (low felt, high felt)
    const tokenIdHex = "0x" + BigInt(tokenId).toString(16);

    const res = await fetch(STARKNET_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "starknet_call",
        params: {
          request: {
            contract_address: NFT_CONTRACT_ADDRESS,
            entry_point_selector: TOKEN_URI_SELECTOR,
            calldata: [tokenIdHex, "0x0"],
          },
          block_id: "latest",
        },
      }),
    });

    if (!res.ok) return fallback;
    const json = await res.json();
    if (!json.result || !Array.isArray(json.result)) return fallback;

    const rawStr = decodeByteArray(json.result);
    const jsonStr = rawStr.replace(/^data:application\/json;utf8,/, "");
    const metadata: TokenUriMetadata = JSON.parse(jsonStr);

    const attrVal = (trait: string) =>
      metadata.attributes?.find((a) => a.trait_type === trait)?.value ?? "";

    const meta: CardMetadata = {
      name: metadata.name ?? fallback.name,
      isSpecial: attrVal("is_special").toLowerCase() === "true",
      season: parseInt(attrVal("token")) || 1,
    };
    cardMetaCache[cardId] = meta;
    return meta;
  } catch {
    return fallback;
  }
}

// Decodes a Cairo ByteArray: [array_len, ...31-byte chunks, pending_word, pending_len]
function decodeByteArray(result: string[]): string {
  if (!result.length) return "";
  try {
    const chunkCount = parseInt(result[0], 16);
    let text = "";
    for (let i = 1; i <= chunkCount; i++) {
      text += hexChunkToUtf8(result[i], 31);
    }
    const pendingLen = parseInt(result[chunkCount + 2] ?? "0", 16);
    if (pendingLen > 0) {
      text += hexChunkToUtf8(result[chunkCount + 1], pendingLen);
    }
    return text;
  } catch {
    return "";
  }
}

function hexChunkToUtf8(hex: string, byteLen: number): string {
  const clean = hex.replace(/^0x/, "").padStart(byteLen * 2, "0");
  const bytes: number[] = [];
  const start = clean.length - byteLen * 2;
  for (let i = start; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export async function getUserCards(userAddress: string): Promise<UserCard[]> {
  if (!userAddress) throw new Error("getUserCards: userAddress is required");
  if (!GAME_API_KEY) throw new Error("getUserCards: Missing VITE_GAME_API_KEY");

  const baseUrl = GAME_API_URL.replace(/\/$/, "");
  const res = await fetch(`${baseUrl}/api/nft/${encodeURIComponent(userAddress)}`, {
    method: "GET",
    headers: { "X-API-Key": GAME_API_KEY },
  });

  if (!res.ok) throw new Error(`getUserCards: ${res.status} ${res.statusText}`);

  const json: GetUserCardsApiResponse = await res.json();
  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("getUserCards: Invalid API response");
  }

  const cards = json.data.map((entry) => ({
    tokenId: entry.token_id,
    marketable: Boolean(entry.marketable),
    cardId: Number(entry.card_id),
    rarity: Number(entry.rarity),
    count: Number(entry.count),
    owner: entry.owner,
    skinId: Number(entry.skin_id),
    skinRarity: Number(entry.skin_rarity),
    quality: Number(entry.quality),
    isSpecial: false,
    season: 1,
  }));

  // Fetch token_uri once per card_id (name and is_special are card-type properties)
  // Use the first tokenId we encounter for each cardId
  const cardIdToTokenId: Record<number, string> = {};
  for (const c of cards) {
    if (!(c.cardId in cardIdToTokenId)) {
      cardIdToTokenId[c.cardId] = c.tokenId;
    }
  }

  await Promise.all(
    Object.entries(cardIdToTokenId).map(([cardId, tokenId]) =>
      fetchCardMeta(tokenId, Number(cardId))
    )
  );

  return cards.map((card) => {
    const meta = cardMetaCache[card.cardId];
    return {
      ...card,
      cardName: meta?.name ?? `Card #${card.cardId}`,
      isSpecial: meta?.isSpecial ?? false,
      season: meta?.season ?? 1,
    };
  });
}
