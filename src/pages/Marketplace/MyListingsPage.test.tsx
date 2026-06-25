/* @vitest-environment jsdom */

import { ChakraProvider } from "@chakra-ui/react";
import { act, cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { MyListingsPage } from "./MyListingsPage";
import type { Listing } from "../../marketplace/types/marketplace";

const mocks = vi.hoisted(() => ({
  account: {
    execute: vi.fn(),
    waitForTransaction: vi.fn(),
  },
  cancelListing: vi.fn(),
  compileCalldata: vi.fn((value) => value),
  getSellerListings: vi.fn(),
  navigate: vi.fn(),
  showErrorToast: vi.fn(),
}));

vi.mock("@starknet-react/core", () => ({
  useAccount: () => ({
    account: mocks.account,
    address: "0xseller",
    status: "connected",
  }),
}));

vi.mock("starknet", () => ({
  CallData: {
    compile: mocks.compileCalldata,
  },
}));

vi.mock("../../marketplace/api/marketplace", () => ({
  cancelListing: mocks.cancelListing,
  getSellerListings: mocks.getSellerListings,
}));

vi.mock("../../marketplace/config/contracts", () => ({
  MARKETPLACE_CONTRACT_ADDRESS: "0xmarket",
  getPaymentToken: () => ({ address: "0xstrk", symbol: "STRK", decimals: 18 }),
}));

vi.mock("../../hooks/useCustomToast", () => ({
  useCustomToast: () => ({
    showErrorToast: mocks.showErrorToast,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) =>
      params?.status ? `${key}:${params.status}` : key,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock("../../marketplace/hooks/usePrices", () => ({
  formatUsd: () => null,
  toUsd: () => null,
  usePrices: () => ({ ETH: null, STRK: null }),
}));

vi.mock("../../marketplace/hooks/useCardName", () => ({
  useCardName: (_cardId: number, fallback: string) => fallback,
}));

vi.mock("../../marketplace/components/AutoFitCardTitle", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    AutoFitCardTitle: ({ children }: { children: string }) =>
      React.createElement("span", null, children),
  };
});

vi.mock("../../marketplace/components/CardImage", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    CardImage: () => React.createElement("div", { "data-testid": "card-image" }),
  };
});

vi.mock("../../marketplace/components/CardTooltip", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    CardTooltip: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

vi.mock("../../marketplace/components/TokenIcon", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    TokenIcon: () => React.createElement("span", null, "STRK"),
  };
});

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

function renderPage() {
  return render(
    <ChakraProvider>
      <MemoryRouter>
        <MyListingsPage />
      </MemoryRouter>
    </ChakraProvider>
  );
}

async function waitForExpect(assertion: () => void) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      assertion();
      return;
    } catch (err) {
      lastError = err;
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    }
  }

  throw lastError;
}

beforeEach(() => {
  mocks.account.execute.mockResolvedValue({ transaction_hash: "0xtx" });
  mocks.account.waitForTransaction.mockResolvedValue({});
  mocks.cancelListing.mockResolvedValue(undefined);
  mocks.getSellerListings.mockResolvedValue({ data: [] });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("defaults to active listings", async () => {
  mocks.getSellerListings.mockResolvedValue({
    data: [
      listing({ id: "active", card_name: "Active Card" }),
      listing({ id: "expired", card_name: "Expired Card", expiration: now - 60 }),
    ],
  });

  const view = renderPage();

  await view.findByText("Active Card");

  expect(view.queryByText("Expired Card")).toBeNull();
});

test("cancels an active listing and moves it to cancelled", async () => {
  mocks.getSellerListings.mockResolvedValue({ data: [listing()] });

  const view = renderPage();

  const cancelButton = await view.findByText("myListings.cancel");
  await act(async () => {
    cancelButton.click();
  });

  await waitForExpect(() => expect(mocks.cancelListing).toHaveBeenCalledWith("listing-1"));

  expect(mocks.account.execute).toHaveBeenCalledWith([
    {
      contractAddress: "0xmarket",
      entrypoint: "cancel_order",
      calldata: { nonce: 7 },
    },
  ]);
  expect(mocks.account.waitForTransaction).toHaveBeenCalledWith("0xtx");

  await act(async () => {
    view.getByText(/myListings\.tabCancelled/).click();
  });

  expect(await view.findByText("myListings.statusLineCancelled")).toBeTruthy();
});

test("re-lists an expired listing without an on-chain cancel", async () => {
  mocks.getSellerListings.mockResolvedValue({
    data: [listing({ expiration: now - 60 })],
  });

  const view = renderPage();

  const expiredTab = await view.findByText(/myListings\.tabExpired/);
  await act(async () => {
    expiredTab.click();
  });
  const relistButton = await view.findByText("myListings.relist");
  await act(async () => {
    relistButton.click();
  });

  await waitForExpect(() => expect(mocks.cancelListing).toHaveBeenCalledWith("listing-1"));

  expect(mocks.account.execute).not.toHaveBeenCalled();
  expect(mocks.navigate).toHaveBeenCalledWith("/sell", {
    state: {
      preselectedCard: {
        tokenId: "101",
        cardId: 10101,
        cardName: "Active Card",
        rarity: 1,
        season: 1,
        skinId: 0,
        quality: 0,
        marketable: true,
        isSpecial: true,
        count: 1,
        owner: "0xseller",
        skinRarity: 0,
      },
    },
  });
});

test("does not navigate when closing an expired listing fails before re-list", async () => {
  mocks.cancelListing.mockRejectedValue(new Error("failed to fetch"));
  mocks.getSellerListings.mockResolvedValue({
    data: [listing({ expiration: now - 60 })],
  });

  const view = renderPage();

  const expiredTab = await view.findByText(/myListings\.tabExpired/);
  await act(async () => {
    expiredTab.click();
  });
  const relistButton = await view.findByText("myListings.relist");
  await act(async () => {
    relistButton.click();
  });

  await waitForExpect(() =>
    expect(mocks.showErrorToast).toHaveBeenCalledWith(
      "Network error. Check your connection and try again."
    )
  );

  expect(mocks.navigate).not.toHaveBeenCalled();
  expect(view.getByText("Active Card")).toBeTruthy();
});

test("continues re-list when the expired listing was already removed", async () => {
  mocks.cancelListing.mockRejectedValue(new Error("API 404: Listing not found"));
  mocks.getSellerListings.mockResolvedValue({
    data: [listing({ expiration: now - 60 })],
  });

  const view = renderPage();

  const expiredTab = await view.findByText(/myListings\.tabExpired/);
  await act(async () => {
    expiredTab.click();
  });
  const relistButton = await view.findByText("myListings.relist");
  await act(async () => {
    relistButton.click();
  });

  await waitForExpect(() => expect(mocks.cancelListing).toHaveBeenCalledWith("listing-1"));

  expect(mocks.showErrorToast).not.toHaveBeenCalled();
  expect(mocks.navigate).toHaveBeenCalledWith("/sell", {
    state: {
      preselectedCard: {
        tokenId: "101",
        cardId: 10101,
        cardName: "Active Card",
        rarity: 1,
        season: 1,
        skinId: 0,
        quality: 0,
        marketable: true,
        isSpecial: true,
        count: 1,
        owner: "0xseller",
        skinRarity: 0,
      },
    },
  });
});

test("keeps listings visible and shows a toast when cancelling is rejected", async () => {
  mocks.account.execute.mockRejectedValue(new Error("user rejected"));
  mocks.getSellerListings.mockResolvedValue({ data: [listing()] });

  const view = renderPage();

  const cancelButton = await view.findByText("myListings.cancel");
  await act(async () => {
    cancelButton.click();
  });

  await waitForExpect(() =>
    expect(mocks.showErrorToast).toHaveBeenCalledWith("Transaction cancelled.")
  );

  expect(view.getByText("Active Card")).toBeTruthy();
  expect(mocks.cancelListing).not.toHaveBeenCalled();
});
