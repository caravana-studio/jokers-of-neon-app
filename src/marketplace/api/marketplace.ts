import { getApiUrl, MARKETPLACE_API_KEY } from "../config/contracts";
import type {
  Listing,
  CreateListingPayload,
  ListingsFilter,
} from "../types/marketplace";

const baseHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  ...(MARKETPLACE_API_KEY ? { "X-API-Key": MARKETPLACE_API_KEY } : {}),
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: { ...baseHeaders, ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getListings(
  filter?: ListingsFilter
): Promise<{ data: Listing[]; total: number }> {
  const params = new URLSearchParams();
  if (filter?.card_id != null) params.set("card_id", String(filter.card_id));
  if (filter?.card_type) params.set("card_type", filter.card_type);
  if (filter?.rarity != null) params.set("rarity", String(filter.rarity));
  if (filter?.payment_token) params.set("payment_token", filter.payment_token);
  if (filter?.min_price) params.set("min_price", filter.min_price);
  if (filter?.max_price) params.set("max_price", filter.max_price);
  if (filter?.sort) params.set("sort", filter.sort);
  if (filter?.page != null) params.set("page", String(filter.page));
  if (filter?.limit != null) params.set("limit", String(filter.limit));

  const qs = params.toString();
  return apiFetch(`/api/marketplace/listings${qs ? `?${qs}` : ""}`);
}

export async function getListing(id: string): Promise<Listing> {
  const res = await apiFetch<{ success: boolean; data: Listing }>(`/api/marketplace/listings/${id}`);
  return res.data;
}

export async function getSellerListings(
  address: string
): Promise<{ data: Listing[] }> {
  return apiFetch(`/api/marketplace/listings/seller/${address}`);
}

export async function getNextNonce(address: string): Promise<{ nonce: number }> {
  return apiFetch(`/api/marketplace/listings/nonce/${address}`);
}

export async function createListing(
  payload: CreateListingPayload
): Promise<Listing> {
  return apiFetch("/api/marketplace/listings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelListing(id: string): Promise<void> {
  await apiFetch(`/api/marketplace/listings/${id}`, {
    method: "DELETE",
  });
}

export async function reportListingFilled(
  id: string,
  txHash: string,
  buyerAddress: string
): Promise<void> {
  await fetch(`${getApiUrl()}/api/marketplace/listings/${id}/fill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tx_hash: txHash, buyer_address: buyerAddress }),
  });
}
