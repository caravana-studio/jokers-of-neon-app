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
import { useAccount } from "@starknet-react/core";
import { REVENUECAT_API_KEY } from "../config/contracts";

type WebPurchasesInstance = ReturnType<typeof WebPurchases.configure>;

type RevenueCatProductSummary = {
  id: string;
  formattedPrice: string;
};

type RevenueCatFormattedOfferings = {
  packs: RevenueCatProductSummary[];
  packPackages: Record<string, WebPackage>;
  seasonPass: RevenueCatProductSummary | null;
  seasonPassPackage: WebPackage | null;
};

type RevenueCatPurchaseOptions = {
  customerEmail?: string;
  htmlTarget?: HTMLElement;
  selectedLocale?: string;
  defaultLocale?: string;
};

type RevenueCatContextValue = {
  offerings: RevenueCatFormattedOfferings | null;
  loading: boolean;
  refreshOfferings: () => Promise<void>;
  purchasePackage: (
    rcPackage: WebPackage,
    options?: RevenueCatPurchaseOptions
  ) => Promise<WebPurchaseResult>;
};

const RevenueCatContext = createContext<RevenueCatContextValue>({
  offerings: null,
  loading: false,
  refreshOfferings: async () => {},
  purchasePackage: async (): Promise<WebPurchaseResult> => {
    throw new Error("purchasePackage: RevenueCat provider not initialized");
  },
});

const isSeasonPassIdentifier = (identifier: string) => {
  const normalized = identifier.toLowerCase();
  return normalized.includes("season") && normalized.includes("pass");
};

const normalizeOfferings = (
  rawOfferings: WebOfferings | null
): RevenueCatFormattedOfferings | null => {
  if (!rawOfferings) return null;

  const current = rawOfferings.current;
  if (!current) {
    return { packs: [], packPackages: {}, seasonPass: null, seasonPassPackage: null };
  }

  const availablePackages = current.availablePackages ?? [];
  const packs: RevenueCatProductSummary[] = [];
  const packPackages: Record<string, WebPackage> = {};
  let seasonPass: RevenueCatProductSummary | null = null;
  let seasonPassPackage: WebPackage | null = null;

  for (const pkg of availablePackages) {
    const id = pkg.identifier;
    const price = pkg.webBillingProduct?.defaultNonSubscriptionOption?.basePrice;
    const formattedPrice = price?.formattedPrice;
    if (!id || !formattedPrice) continue;

    const summary = { id, formattedPrice };

    if (isSeasonPassIdentifier(id)) {
      if (!seasonPass) {
        seasonPass = summary;
        seasonPassPackage = pkg;
      }
    } else {
      if (!packs.some((p) => p.id === id)) {
        packs.push(summary);
        packPackages[id] = pkg;
      }
    }
  }

  return { packs, packPackages, seasonPass, seasonPassPackage };
};

const ANON_RC_USER = "jokers_anon_guest";

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const { address } = useAccount();

  const [offerings, setOfferings] = useState<RevenueCatFormattedOfferings | null>(null);
  const [loading, setLoading] = useState(false);
  const purchasesRef = useRef<WebPurchasesInstance | null>(null);
  const configuredUserRef = useRef<string | null>(null);

  const fetchOfferings = useCallback(async () => {
    if (!purchasesRef.current) return;
    setLoading(true);
    try {
      const webOfferings = await purchasesRef.current.getOfferings();
      setOfferings(normalizeOfferings(webOfferings));
    } catch (error) {
      console.error("Failed to fetch RevenueCat offerings", error);
      setOfferings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!REVENUECAT_API_KEY) return;
    const effectiveUserId = address ?? ANON_RC_USER;
    if (configuredUserRef.current === effectiveUserId) return;

    try {
      const instance = WebPurchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserId: effectiveUserId,
      });
      purchasesRef.current = instance;
      configuredUserRef.current = effectiveUserId;
      fetchOfferings();
    } catch (error) {
      console.error("Failed to configure RevenueCat", error);
    }
  }, [address, fetchOfferings]);

  const purchasePackage = useCallback(
    async (
      rcPackage: WebPackage,
      options?: RevenueCatPurchaseOptions
    ): Promise<WebPurchaseResult> => {
      if (!purchasesRef.current) {
        throw new Error("RevenueCat not initialized");
      }
      return purchasesRef.current.purchase({
        rcPackage,
        customerEmail: options?.customerEmail,
        htmlTarget: options?.htmlTarget,
        selectedLocale: options?.selectedLocale,
        defaultLocale: options?.defaultLocale,
      });
    },
    []
  );

  const value = useMemo<RevenueCatContextValue>(
    () => ({ offerings, loading, refreshOfferings: fetchOfferings, purchasePackage }),
    [offerings, loading, fetchOfferings, purchasePackage]
  );

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => useContext(RevenueCatContext);
