/* @vitest-environment jsdom */

import { ChakraProvider } from "@chakra-ui/react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, test, vi } from "vitest";
import { MyListingCard } from "./MyListingCard";
import type { Listing } from "../types/marketplace";
import type { ReactNode } from "react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../hooks/usePrices", () => ({
  formatUsd: () => null,
  toUsd: () => null,
  usePrices: () => ({ ETH: null, STRK: null }),
}));

vi.mock("../hooks/useCardName", () => ({
  useCardName: (_cardId: number, fallback: string) => fallback,
}));

vi.mock("./AutoFitCardTitle", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    AutoFitCardTitle: ({ children }: { children: string }) =>
      React.createElement("span", null, children),
  };
});

vi.mock("./CardImage", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    CardImage: () => React.createElement("div", { "data-testid": "card-image" }),
  };
});

vi.mock("./CardTooltip", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    CardTooltip: ({ children }: { children: ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

vi.mock("./TokenIcon", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    TokenIcon: () => React.createElement("span", null, "STRK"),
  };
});

vi.mock("../config/contracts", () => ({
  getPaymentToken: () => ({ address: "0xstrk", symbol: "STRK", decimals: 18 }),
}));

const activeListing: Listing = {
  id: "listing-1",
  seller_address: "0xseller",
  nft_contract: "0xnft",
  token_id: "101",
  payment_token: "0xstrk",
  price: "1000000000000000000",
  nonce: 7,
  expiration: Math.floor(Date.now() / 1000) + 3600,
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
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("cancel action does not bubble through the listing link", () => {
  const onCancel = vi.fn();
  const onRelist = vi.fn();
  const onParentClick = vi.fn();

  render(
    <ChakraProvider>
      <div onClick={onParentClick}>
        <MemoryRouter>
          <MyListingCard
            listing={activeListing}
            onCancel={onCancel}
            onRelist={onRelist}
            isCancelling={false}
            isRelisting={false}
          />
        </MemoryRouter>
      </div>
    </ChakraProvider>
  );

  fireEvent.click(screen.getByText("myListings.cancel"));

  expect(onCancel).toHaveBeenCalledWith(activeListing);
  expect(onParentClick).not.toHaveBeenCalled();
});
