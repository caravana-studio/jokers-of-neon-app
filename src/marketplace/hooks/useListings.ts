import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getListings } from "../api/marketplace";
import { useMarketplaceStore } from "../state/marketplaceStore";
import { usePrices, toUsd } from "./usePrices";
import type { TokenPrices } from "./usePrices";
import { formatTokenAmount } from "../utils/formatPrice";
import { PAYMENT_TOKENS } from "../config/contracts";
import type { Listing } from "../types/marketplace";

const LIMIT = 20;

function getTokenSymbol(address: string): string {
  const token = PAYMENT_TOKENS.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );
  return token?.symbol ?? "TOKEN";
}

function listingUsd(listing: Listing, prices: TokenPrices): number | null {
  const symbol = getTokenSymbol(listing.payment_token);
  return toUsd(formatTokenAmount(listing.price), symbol, prices);
}

export function useListings() {
  const { filter, setFilter } = useMarketplaceStore();
  const prices = usePrices();

  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filterRef = useRef(filter);
  filterRef.current = filter;

  // Only rarity/card_id/payment_token cause a server refetch.
  // Sort and price filters are applied client-side.
  const serverKey = `${filter.rarity ?? ""}|${filter.card_id ?? ""}|${filter.payment_token ?? ""}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPage(1);

    getListings({
      rarity: filter.rarity,
      card_id: filter.card_id,
      payment_token: filter.payment_token,
      sort: "newest",
      page: 1,
      limit: LIMIT,
    })
      .then((result) => {
        if (!cancelled) {
          setListings(result.data);
          setTotal(result.total);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch listings");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [serverKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const f = filterRef.current;
      const result = await getListings({
        rarity: f.rarity,
        card_id: f.card_id,
        payment_token: f.payment_token,
        sort: "newest",
        page: nextPage,
        limit: LIMIT,
      });
      setListings((prev) => [...prev, ...result.data]);
      setPage(nextPage);
    } catch {}
    setLoadingMore(false);
  }, [page]);

  // Client-side sort + USD price filter applied to the full loaded batch
  const displayed = useMemo(() => {
    let result = [...listings];

    // USD price filters (only when prices are available)
    const pricesReady = prices.STRK !== null || prices.ETH !== null;
    if (pricesReady) {
      if (filter.min_price) {
        const minUsd = parseFloat(filter.min_price);
        if (!isNaN(minUsd)) {
          result = result.filter((l) => (listingUsd(l, prices) ?? 0) >= minUsd);
        }
      }
      if (filter.max_price) {
        const maxUsd = parseFloat(filter.max_price);
        if (!isNaN(maxUsd)) {
          result = result.filter((l) => (listingUsd(l, prices) ?? Infinity) <= maxUsd);
        }
      }
    }

    // Sort
    switch (filter.sort ?? "newest") {
      case "price_asc":
        result.sort((a, b) => {
          const aUsd = listingUsd(a, prices);
          const bUsd = listingUsd(b, prices);
          if (aUsd !== null && bUsd !== null) return aUsd - bUsd;
          // fallback: compare raw bigints within same token
          return BigInt(a.price) < BigInt(b.price) ? -1 : 1;
        });
        break;
      case "price_desc":
        result.sort((a, b) => {
          const aUsd = listingUsd(a, prices);
          const bUsd = listingUsd(b, prices);
          if (aUsd !== null && bUsd !== null) return bUsd - aUsd;
          return BigInt(a.price) > BigInt(b.price) ? -1 : 1;
        });
        break;
      case "oldest":
        result.sort((a, b) => a.created_at.localeCompare(b.created_at));
        break;
      case "newest":
      default:
        result.sort((a, b) => b.created_at.localeCompare(a.created_at));
        break;
    }

    return result;
  }, [listings, filter.sort, filter.min_price, filter.max_price, prices]);

  return {
    listings: displayed,
    total,
    loading,
    loadingMore,
    error,
    filter,
    setFilter,
    loadMore,
    // hasMore compares raw loaded count vs server total (unaffected by client filter)
    hasMore: listings.length < total,
  };
}
