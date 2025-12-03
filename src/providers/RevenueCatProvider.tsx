import type {
  PurchasesPackage as NativePackage,
  MakePurchaseResult as NativePurchaseResult,
} from "@revenuecat/purchases-capacitor";
import {
  Purchases as CapacitorPurchases,
  LOG_LEVEL,
  PurchasesOfferings as NativeOfferings,
} from "@revenuecat/purchases-capacitor";
import type {
  Package as WebPackage,
  PurchaseResult as WebPurchaseResult,
} from "@revenuecat/purchases-js";
import {
  Offerings as WebOfferings,
  Purchases as WebPurchases,
} from "@revenuecat/purchases-js";
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
import { useDojo } from "../dojo/DojoContext";
import { useUsername } from "../dojo/utils/useUsername";
import { isNative } from "../utils/capacitorUtils";
import { getRevenueCatApiKey } from "../utils/getRevenueCatApiKey";

type WebPurchasesInstance = ReturnType<typeof WebPurchases.configure>;
type PurchasesClient = WebPurchasesInstance | typeof CapacitorPurchases;

type RevenueCatPackage = NativePackage | WebPackage;
export type RevenueCatPurchaseResult = WebPurchaseResult | NativePurchaseResult;

type RevenueCatPurchaseOptions = {
  customerEmail?: string;
  htmlTarget?: HTMLElement;
  selectedLocale?: string;
  defaultLocale?: string;
  metadata?: Record<string, string | null> | null;
  skipSuccessPage?: boolean;
};

type RevenueCatProductSummary = {
  id: string;
  formattedPrice: string;
};

type RevenueCatFormattedOfferings = {
  packs: RevenueCatProductSummary[];
  packPackages: Record<string, RevenueCatPackage>;
  seasonPass: RevenueCatProductSummary | null;
  seasonPassPackage: RevenueCatPackage | null;
};

type RevenueCatContextValue = {
  userId: string | null;
  offerings: RevenueCatFormattedOfferings | null;
  loading: boolean;
  refreshOfferings: () => Promise<void>;
  purchases: PurchasesClient | null;
  purchasePackage: (
    rcPackage: RevenueCatPackage,
    options?: RevenueCatPurchaseOptions
  ) => Promise<RevenueCatPurchaseResult>;
  purchasePackageById: (
    packageId: string,
    options?: RevenueCatPurchaseOptions
  ) => Promise<RevenueCatPurchaseResult>;
};

const RevenueCatContext = createContext<RevenueCatContextValue>({
  userId: null,
  offerings: null,
  loading: false,
  refreshOfferings: async () => {},
  purchases: null,
  purchasePackage: async (): Promise<RevenueCatPurchaseResult> => {
    throw new Error("purchasePackage: RevenueCat provider not initialized");
  },
  purchasePackageById: async (): Promise<RevenueCatPurchaseResult> => {
    throw new Error("purchasePackageById: RevenueCat provider not initialized");
  },
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
  if (!current || !isRecord(current)) {
    return {
      packs: [],
      packPackages: {},
      seasonPass: null,
      seasonPassPackage: null,
    };
  }

  const availablePackages = Array.isArray(current.availablePackages)
    ? (current.availablePackages as unknown[])
    : isRecord(current.packagesById)
    ? (Object.values(current.packagesById) as unknown[])
    : [];

  const packs: RevenueCatProductSummary[] = [];
  const packPackages: Record<string, RevenueCatPackage> = {};
  let seasonPass: RevenueCatProductSummary | null = null;
  let seasonPassPackage: RevenueCatPackage | null = null;

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
        seasonPassPackage = pkg as RevenueCatPackage;
      }
    } else {
      if (!packs.some((pack) => pack.id === summary.id)) {
        packs.push(summary);
        packPackages[summary.id] = pkg as RevenueCatPackage;
      }
    }
  }

  return {
    packs,
    packPackages,
    seasonPass,
    seasonPassPackage,
  };
};

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const username = useUsername();
  const {
    account: { account },
  } = useDojo();

  const userId =
    username && account?.address ? `${username},${account.address}` : null;
  const [offerings, setOfferings] =
    useState<RevenueCatFormattedOfferings | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasesClient, setPurchasesClient] =
    useState<PurchasesClient | null>(isNative ? CapacitorPurchases : null);
  const purchasesRef = useRef<PurchasesClient | null>(purchasesClient);
  const hasConfiguredRef = useRef(false);
  const lastUsernameRef = useRef<string | null>(null);

  useEffect(() => {
    purchasesRef.current = purchasesClient;
  }, [purchasesClient]);

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
    if (!userId || !username || !account?.address || hasConfiguredRef.current) {
      return;
    }

    try {
      const apiKey = getRevenueCatApiKey();

      if (isNative) {
        await CapacitorPurchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
        await CapacitorPurchases.configure({
          apiKey,
          appUserID: userId,
        });
        purchasesRef.current = CapacitorPurchases;
        setPurchasesClient(CapacitorPurchases);
      } else {
        const purchasesInstance = WebPurchases.configure({
          apiKey,
          appUserId: userId,
        });
        purchasesRef.current = purchasesInstance;
        setPurchasesClient(purchasesInstance);
      }

      hasConfiguredRef.current = true;
      lastUsernameRef.current = userId;
      await fetchOfferings();
    } catch (error) {
      console.error("Failed to configure RevenueCat", error);
      setOfferings(null);
      setLoading(false);
    }
  }, [fetchOfferings, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (!hasConfiguredRef.current) {
      configureRevenueCat();
      return;
    }

    if (lastUsernameRef.current !== userId) {
      lastUsernameRef.current = userId;
      fetchOfferings();
    }
  }, [configureRevenueCat, fetchOfferings, userId]);

  const purchasePackage = useCallback(
    async (
      rcPackage: RevenueCatPackage,
      options?: RevenueCatPurchaseOptions
    ): Promise<RevenueCatPurchaseResult> => {
      if (!rcPackage) {
        throw new Error("purchasePackage: missing package");
      }

      if (!purchasesRef.current) {
        throw new Error(
          "purchasePackage: RevenueCat purchases client not available"
        );
      }

      if (isNative) {
        return (
          purchasesRef.current as typeof CapacitorPurchases
        ).purchasePackage({
          aPackage: rcPackage as NativePackage,
        });
      } else {
        return (purchasesRef.current as WebPurchasesInstance).purchase({
          rcPackage: rcPackage as WebPackage,
          customerEmail: options?.customerEmail,
          htmlTarget: options?.htmlTarget,
          selectedLocale: options?.selectedLocale,
          defaultLocale: options?.defaultLocale,
          metadata: options?.metadata ?? undefined,
          skipSuccessPage: options?.skipSuccessPage,
        });
      }
    },
    []
  );

  const purchasePackageById = useCallback(
    async (
      packageId: string,
      options?: RevenueCatPurchaseOptions
    ): Promise<RevenueCatPurchaseResult> => {
      if (!packageId) {
        throw new Error("purchasePackageById: missing package id");
      }

      const normalizedId = packageId.toLowerCase();

      let resolvedPackage: RevenueCatPackage | null = null;

      if (
        offerings?.seasonPassPackage &&
        getPackageIdentifier(offerings.seasonPassPackage)?.toLowerCase() ===
          normalizedId
      ) {
        resolvedPackage = offerings.seasonPassPackage;
      } else if (offerings?.packPackages) {
        const candidate = offerings.packPackages[packageId];
        const fallbackCandidate =
          offerings.packPackages[normalizedId] ??
          offerings.packPackages[
            Object.keys(offerings.packPackages).find(
              (key) => key.toLowerCase() === normalizedId
            ) ?? ""
          ];
        resolvedPackage = candidate ?? fallbackCandidate ?? null;
      }

      if (!resolvedPackage) {
        throw new Error(
          `purchasePackageById: package '${packageId}' not found in offerings`
        );
      }

      return purchasePackage(resolvedPackage, options);
    },
    [offerings, purchasePackage]
  );

  const value = useMemo<RevenueCatContextValue>(
    () => ({
      userId,
      offerings,
      loading,
      refreshOfferings: fetchOfferings,
      purchases: purchasesClient,
      purchasePackage,
      purchasePackageById,
    }),
    [
      userId,
      fetchOfferings,
      loading,
      offerings,
      purchasesClient,
      purchasePackage,
      purchasePackageById,
    ]
  );

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => useContext(RevenueCatContext);
