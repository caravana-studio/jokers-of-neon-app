import { logEvent } from "./analytics";

export type PurchaseChannel = "ios" | "android" | "web" | "crypto";
export type PurchaseKind = "season_pass" | "pack" | "marketplace_listing";
export type PurchaseSurface = "shop" | "marketplace";

type TrackApprovedPurchaseInput = {
  transactionId: string;
  purchaseChannel: PurchaseChannel;
  purchaseKind: PurchaseKind;
  purchaseSurface: PurchaseSurface;
  paymentProvider: string;
  productId: string;
  productName?: string | null;
  quantity?: number;
  value?: number | null;
  currency?: string | null;
  tokenSymbol?: string | null;
  tokenAmount?: number | null;
  extraParams?: Record<string, unknown>;
};

const APPROVED_PURCHASE_EVENT = "approved_purchase";
const TRACKED_PURCHASES_STORAGE_KEY = "analytics_approved_purchases_v1";
const MAX_TRACKED_PURCHASE_IDS = 200;

const trackedPurchaseIds = new Set<string>();
let didLoadTrackedPurchases = false;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const loadTrackedPurchaseIds = () => {
  if (didLoadTrackedPurchases) return;
  didLoadTrackedPurchases = true;

  const storage = getStorage();
  const rawValue = storage?.getItem(TRACKED_PURCHASES_STORAGE_KEY);
  if (!rawValue) return;

  try {
    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) return;

    parsedValue
      .filter((value): value is string => typeof value === "string")
      .slice(0, MAX_TRACKED_PURCHASE_IDS)
      .forEach((value) => trackedPurchaseIds.add(value));
  } catch {
    // Ignore malformed local state and rebuild it from fresh purchases.
  }
};

const persistTrackedPurchaseIds = () => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(
      TRACKED_PURCHASES_STORAGE_KEY,
      JSON.stringify(Array.from(trackedPurchaseIds).slice(-MAX_TRACKED_PURCHASE_IDS))
    );
  } catch {
    // Best effort only.
  }
};

const reservePurchaseTracking = (transactionId: string): boolean => {
  loadTrackedPurchaseIds();

  if (trackedPurchaseIds.has(transactionId)) {
    return false;
  }

  trackedPurchaseIds.add(transactionId);
  if (trackedPurchaseIds.size > MAX_TRACKED_PURCHASE_IDS) {
    const overflowCount = trackedPurchaseIds.size - MAX_TRACKED_PURCHASE_IDS;
    const values = trackedPurchaseIds.values();
    for (let index = 0; index < overflowCount; index += 1) {
      const nextValue = values.next();
      if (nextValue.done) break;
      trackedPurchaseIds.delete(nextValue.value);
    }
  }

  persistTrackedPurchaseIds();
  return true;
};

export const convertAtomicAmountToNumber = (
  rawAmount: bigint | number | string,
  decimals: number
): number => {
  const normalizedAmount =
    typeof rawAmount === "bigint" ? rawAmount.toString() : String(rawAmount);

  if (!/^-?\d+$/.test(normalizedAmount)) {
    return Number.NaN;
  }

  const negative = normalizedAmount.startsWith("-");
  const digits = negative ? normalizedAmount.slice(1) : normalizedAmount;
  const safeDigits = digits.replace(/^0+(?=\d)/, "") || "0";

  if (decimals <= 0) {
    const parsedInteger = Number(`${negative ? "-" : ""}${safeDigits}`);
    return Number.isFinite(parsedInteger) ? parsedInteger : Number.NaN;
  }

  const paddedDigits =
    safeDigits.length <= decimals
      ? safeDigits.padStart(decimals + 1, "0")
      : safeDigits;
  const integerPart = paddedDigits.slice(0, -decimals) || "0";
  const fractionalPart = paddedDigits.slice(-decimals).replace(/0+$/, "");
  const normalizedNumber = fractionalPart.length
    ? `${negative ? "-" : ""}${integerPart}.${fractionalPart}`
    : `${negative ? "-" : ""}${integerPart}`;

  const parsedValue = Number(normalizedNumber);
  return Number.isFinite(parsedValue) ? parsedValue : Number.NaN;
};

export const trackApprovedPurchase = (
  input: TrackApprovedPurchaseInput
): boolean => {
  const transactionId = input.transactionId.trim();
  if (!transactionId) {
    return false;
  }

  if (!reservePurchaseTracking(transactionId)) {
    return false;
  }

  const quantity =
    typeof input.quantity === "number" && input.quantity > 0
      ? Math.floor(input.quantity)
      : 1;
  const productName = input.productName?.trim() || input.productId;
  const hasRevenue =
    isFiniteNumber(input.value) &&
    input.value > 0 &&
    typeof input.currency === "string" &&
    input.currency.length > 0;

  const item: Record<string, unknown> = {
    item_id: input.productId,
    item_name: productName,
    item_category: input.purchaseKind,
    item_category2: input.purchaseSurface,
    item_variant: input.purchaseChannel,
    quantity,
  };

  if (hasRevenue) {
    item.price = input.value;
  }

  const params: Record<string, unknown> = {
    transaction_id: transactionId,
    purchase_channel: input.purchaseChannel,
    purchase_kind: input.purchaseKind,
    purchase_surface: input.purchaseSurface,
    payment_provider: input.paymentProvider,
    product_id: input.productId,
    product_name: productName,
    quantity,
    items: [item],
    ...input.extraParams,
  };

  if (hasRevenue) {
    params.value = input.value;
    params.currency = input.currency;
  }

  if (input.tokenSymbol) {
    params.token_symbol = input.tokenSymbol;
  }

  if (isFiniteNumber(input.tokenAmount) && input.tokenAmount > 0) {
    params.token_amount = input.tokenAmount;
  }

  logEvent(APPROVED_PURCHASE_EVENT, params);
  return true;
};
