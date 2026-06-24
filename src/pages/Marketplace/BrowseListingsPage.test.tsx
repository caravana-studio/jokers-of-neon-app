/* @vitest-environment jsdom */

import { ChakraProvider } from "@chakra-ui/react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { BrowseListingsPage } from "./BrowseListingsPage";
import type { Listing } from "../../marketplace/types/marketplace";

const mocks = vi.hoisted(() => ({
  useListings: vi.fn(),
}));

vi.mock("../../marketplace/hooks/useListings", () => ({
  useListings: mocks.useListings,
}));

vi.mock("../../marketplace/components/ListingCard", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    ListingCard: ({ listing }: { listing: Listing }) =>
      React.createElement("div", null, listing.card_name),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const now = Math.floor(Date.now() / 1000);

function listing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_address: "0xseller",
    nft_contract: "0xnft",
    token_id: "101",
    payment_token: "0xstrk",
    price: "1000000000000000000",
    nonce: 7,
    expiration: now + 3600,
    marketplace_address: "0xmarket",
    signature: ["0xsig"],
    card_id: 10101,
    card_name: "Active Card",
    rarity: 1,
    season: 1,
    skin_id: 0,
    quality: 0,
    image_url: "/card.png",
    status: "active",
    buyer_address: null,
    fill_tx_hash: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function listingsState(listings: Listing[]) {
  return {
    listings,
    total: listings.length,
    loading: false,
    loadingMore: false,
    error: null,
    filter: { sort: "newest" },
    setFilter: vi.fn(),
    loadMore: vi.fn(),
    loadedCount: listings.length,
    hasMore: false,
  };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("hides expired listings returned by the marketplace API", () => {
  mocks.useListings.mockImplementation((cardType: string) =>
    cardType === "special"
      ? listingsState([
          listing({ id: "active", card_name: "Active Card" }),
          listing({
            id: "expired",
            card_name: "Expired Card",
            expiration: now - 60,
          }),
        ])
      : listingsState([])
  );

  render(
    <ChakraProvider>
      <BrowseListingsPage />
    </ChakraProvider>
  );

  expect(screen.queryByText("Active Card")).toBeTruthy();
  expect(screen.queryByText("Expired Card")).toBeNull();
});
