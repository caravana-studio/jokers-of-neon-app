import { create } from "zustand";
import type { Listing, ListingsFilter, ListingStatus } from "../types/marketplace";

interface MarketplaceState {
  listings: Listing[];
  total: number;
  loading: boolean;
  error: string | null;
  filter: ListingsFilter;

  setListings: (listings: Listing[], total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: Partial<ListingsFilter>) => void;
  updateListingStatus: (id: string, status: ListingStatus) => void;
  removeListing: (id: string) => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  listings: [],
  total: 0,
  loading: false,
  error: null,
  filter: {
    sort: "newest",
    page: 1,
    limit: 20,
  },

  setListings: (listings, total) => set({ listings, total, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  setFilter: (partial) =>
    set((state) => ({
      filter: { ...state.filter, ...partial, page: partial.page ?? 1 },
    })),
  updateListingStatus: (id, status) =>
    set((state) => ({
      listings: state.listings.map((l) =>
        l.id === id ? { ...l, status } : l
      ),
    })),
  removeListing: (id) =>
    set((state) => ({
      listings: state.listings.filter((l) => l.id !== id),
      total: state.total - 1,
    })),
}));
