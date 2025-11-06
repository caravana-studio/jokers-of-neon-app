import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Purchases as CapacitorPurchases,
  LOG_LEVEL,
  PurchasesOfferings as NativeOfferings,
} from "@revenuecat/purchases-capacitor";
import {
  Purchases as WebPurchases,
  Offerings as WebOfferings,
} from "@revenuecat/purchases-js";
import { useUsername } from "../dojo/utils/useUsername";
import { isNative } from "../utils/capacitorUtils";
import { getRevenueCatApiKey } from "../utils/getRevenueCatApiKey";

type WebPurchasesInstance = ReturnType<typeof WebPurchases.configure>;
type PurchasesClient = WebPurchasesInstance | typeof CapacitorPurchases;

type RevenueCatProductSummary = {
  id: string;
  formattedPrice: string;
};

type RevenueCatFormattedOfferings = {
  packs: RevenueCatProductSummary[];
  seasonPass: RevenueCatProductSummary | null;
};

type RevenueCatContextValue = {
  offerings: RevenueCatFormattedOfferings | null;
  loading: boolean;
  refreshOfferings: () => Promise<void>;
  purchases: PurchasesClient | null;
};

const RevenueCatContext = createContext<RevenueCatContextValue>({
  offerings: null,
  loading: false,
  refreshOfferings: async () => {},
  purchases: null,
});

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const isSeasonPassIdentifier = (identifier: string) => {
  const normalized = identifier.toLowerCase();
  return normalized.includes("season") && normalized.includes("pass");
};

const getNestedRecord = (value: unknown): UnknownRecord | null =>
  isRecord(value) ? value : null;

const getFormattedPriceFromPriceLike = (value: unknown): string | null => {
  if (!isRecord(value)) {
    return null;
  }

  const formatted = value.formattedPrice;
  return typeof formatted === "string" && formatted.length > 0
    ? formatted
    : null;
};

const getPackageIdentifier = (pkg: unknown): string | null => {
  if (!isRecord(pkg)) {
    return null;
  }

  const { identifier } = pkg;
  if (typeof identifier === "string" && identifier.length > 0) {
    return identifier;
  }

  if ("product" in pkg && isRecord(pkg.product)) {
    const productId = pkg.product.identifier;
    if (typeof productId === "string" && productId.length > 0) {
      return productId;
    }
  }

  if ("webBillingProduct" in pkg && isRecord(pkg.webBillingProduct)) {
    const productId = pkg.webBillingProduct.identifier;
    if (typeof productId === "string" && productId.length > 0) {
      return productId;
    }
  }

  return null;
};

const extractFormattedPrice = (pkg: unknown): string | null => {
  if (!isRecord(pkg)) {
    return null;
  }

  if ("webBillingProduct" in pkg && isRecord(pkg.webBillingProduct)) {
    const webProduct = pkg.webBillingProduct as UnknownRecord;
    const priceCandidates: (UnknownRecord | null)[] = [
      getNestedRecord(webProduct.price),
      getNestedRecord(webProduct.currentPrice),
    ];

    const defaultPurchaseOption = getNestedRecord(
      webProduct.defaultPurchaseOption
    );
    if (defaultPurchaseOption) {
      const basePrice = getNestedRecord(defaultPurchaseOption.basePrice);
      if (basePrice) {
        priceCandidates.push(basePrice);
      }
    }

    const defaultNonSubscriptionOption = getNestedRecord(
      webProduct.defaultNonSubscriptionOption
    );
    if (defaultNonSubscriptionOption) {
      const basePrice = getNestedRecord(defaultNonSubscriptionOption.basePrice);
      if (basePrice) {
        priceCandidates.push(basePrice);
      }
    }

    const defaultSubscriptionOption = getNestedRecord(
      webProduct.defaultSubscriptionOption
    );
    if (defaultSubscriptionOption) {
      const priceOption = getNestedRecord(defaultSubscriptionOption.price);
      if (priceOption) {
        priceCandidates.push(priceOption);
      }
    }

    for (const candidate of priceCandidates) {
      const formatted = getFormattedPriceFromPriceLike(candidate);
      if (formatted) {
        return formatted;
      }
    }
  }

  if ("product" in pkg && isRecord(pkg.product)) {
    const product = pkg.product as UnknownRecord;
    const priceString = product.priceString;
    if (typeof priceString === "string" && priceString.length > 0) {
      return priceString;
    }

    const price = product.price;
    if (typeof price === "number") {
      const currencyCode =
        typeof product.currencyCode === "string" ? product.currencyCode : "";
      if (currencyCode) {
        try {
          return Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currencyCode,
          }).format(price);
        } catch {
          // noop; fallback below
        }
      }
      return price.toString();
    }
  }

  return null;
};

const normalizeOfferings = (
  rawOfferings: NativeOfferings | WebOfferings | null
): RevenueCatFormattedOfferings | null => {
  if (!rawOfferings || !isRecord(rawOfferings)) {
    return null;
  }

  const current = rawOfferings.current;
  if (!current) {
    return {
      packs: [],
      seasonPass: null,
    };
  }

  if (!isRecord(current)) {
    return {
      packs: [],
      seasonPass: null,
    };
  }

  const availablePackages = Array.isArray(current.availablePackages)
    ? (current.availablePackages as unknown[])
    : isRecord(current.packagesById)
    ? (Object.values(current.packagesById) as unknown[])
    : [];

  const packs: RevenueCatProductSummary[] = [];
  let seasonPass: RevenueCatProductSummary | null = null;

  for (const pkg of availablePackages) {
    const id = getPackageIdentifier(pkg);
    const formattedPrice = extractFormattedPrice(pkg);

    if (!id || !formattedPrice) {
      continue;
    }

    const summary = { id, formattedPrice };

    if (isSeasonPassIdentifier(id)) {
      if (!seasonPass) {
        seasonPass = summary;
      }
    } else {
      if (!packs.some((pack) => pack.id === summary.id)) {
        packs.push(summary);
      }
    }
  }

  return {
    packs,
    seasonPass,
  };
};

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const username = useUsername();
  const [offerings, setOfferings] =
    useState<RevenueCatFormattedOfferings | null>(null);
  const [loading, setLoading] = useState(false);
  const purchasesRef = useRef<PurchasesClient | null>(
    isNative ? CapacitorPurchases : null
  );
  const hasConfiguredRef = useRef(false);
  const lastUsernameRef = useRef<string | null>(null);

  const fetchOfferings = useCallback(async () => {
    if (!purchasesRef.current || !hasConfiguredRef.current) {
      return;
    }

    setLoading(true);
    try {
      if (isNative) {
        const nativeOfferings =
          await (purchasesRef.current as typeof CapacitorPurchases).getOfferings();
        setOfferings(normalizeOfferings(nativeOfferings));
      } else {
        const webOfferings =
          await (purchasesRef.current as WebPurchasesInstance).getOfferings();
        setOfferings(normalizeOfferings(webOfferings));
      }
    } catch (error) {
      console.error("Failed to fetch RevenueCat offerings", error);
      setOfferings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const configureRevenueCat = useCallback(async () => {
    if (!username || hasConfiguredRef.current) {
      return;
    }

    try {
      const apiKey = getRevenueCatApiKey();

      if (isNative) {
        await CapacitorPurchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
        await CapacitorPurchases.configure({
          apiKey,
          appUserID: username,
        });
        purchasesRef.current = CapacitorPurchases;
      } else {
        const purchasesInstance = WebPurchases.configure({
          apiKey,
          appUserId: username,
        });
        purchasesRef.current = purchasesInstance;
      }

      hasConfiguredRef.current = true;
      lastUsernameRef.current = username;
      await fetchOfferings();
    } catch (error) {
      console.error("Failed to configure RevenueCat", error);
      setOfferings(null);
      setLoading(false);
    }
  }, [fetchOfferings, username]);

  useEffect(() => {
    if (!username) {
      return;
    }

    if (!hasConfiguredRef.current) {
      configureRevenueCat();
      return;
    }

    if (lastUsernameRef.current !== username) {
      lastUsernameRef.current = username;
      fetchOfferings();
    }
  }, [configureRevenueCat, fetchOfferings, username]);

  const value = useMemo<RevenueCatContextValue>(
    () => ({
      offerings,
      loading,
      refreshOfferings: fetchOfferings,
      purchases: purchasesRef.current,
    }),
    [fetchOfferings, loading, offerings]
  );

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => useContext(RevenueCatContext);
