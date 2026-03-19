export type ListingStatus = "active" | "filled" | "cancelled" | "expired";

export interface Listing {
  id: string;
  seller_address: string;
  nft_contract: string;
  token_id: string;
  payment_token: string;
  price: string;
  nonce: number;
  expiration: number;
  marketplace_address: string;
  signature: string[];
  card_id: number;
  card_name: string;
  rarity: number;
  season: number;
  skin_id: number;
  quality: number;
  image_url: string;
  status: ListingStatus;
  buyer_address: string | null;
  fill_tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateListingPayload {
  seller_address: string;
  nft_contract: string;
  token_id: string;
  payment_token: string;
  price: string;
  nonce: number;
  expiration: number;
  marketplace_address: string;
  signature: string[];
  card_id: number;
  card_name: string;
  rarity: number;
  season: number;
  skin_id: number;
  quality: number;
  image_url: string;
}

export interface ListingsFilter {
  card_id?: number;
  rarity?: number;
  payment_token?: string;
  min_price?: string;
  max_price?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface UserCard {
  tokenId: string;
  marketable: boolean;
  isSpecial: boolean;
  season: number;
  cardId: number;
  cardName?: string;
  rarity: number;
  count: number;
  owner: string;
  skinId: number;
  skinRarity: number;
  quality: number;
}

export const RARITY_LABELS: Record<number, string> = {
  1: "Common",
  2: "Uncommon",
  3: "Rare",
  4: "Epic",
  5: "Legendary",
};

export const RARITY_COLORS: Record<number, string> = {
  1: "#999999",  // C - Common
  2: "#066b9b",  // B - Uncommon
  3: "#ff934b",  // A - Rare
  4: "#A144B2",  // S - Epic
  5: "#f80023",  // SS - Legendary
};
