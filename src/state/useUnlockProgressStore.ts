import { create } from "zustand";
import {
  getPlayerTier,
  getUnlockList,
  UnlockEntryView,
} from "../dojo/queries/getShopUnlockProgress";
import {
  getUnlockedShopTooltipItems,
  ShopTooltipItemKey,
} from "../utils/shopTooltipUnlocks";

const getAddress = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "bigint") return `0x${value.toString(16)}`;
  if (value && typeof value === "object" && "toString" in value) {
    return (value as { toString: () => string }).toString();
  }
  return "";
};

type UnlockProgressStore = {
  playerTier: number;
  totalRuns?: number;
  maxLevel?: number;
  maxRound?: number;
  unlockEntries: UnlockEntryView[];
  unlockedShopItems: Set<ShopTooltipItemKey> | null;
  loading: boolean;
  error: string | null;
  lastAddress?: string;
  lastUpdatedAt?: number;
  refreshUnlockProgress: (client: any, accountAddress: unknown) => Promise<void>;
  clearUnlockProgress: () => void;
};

const initialState = {
  playerTier: 0,
  totalRuns: undefined,
  maxLevel: undefined,
  maxRound: undefined,
  unlockEntries: [],
  unlockedShopItems: null,
  loading: false,
  error: null,
  lastAddress: undefined,
  lastUpdatedAt: undefined,
};

const unlockProgressPromiseCache = new Map<
  string,
  Promise<{
    playerTier: Awaited<ReturnType<typeof getPlayerTier>>;
    unlockEntries: UnlockEntryView[];
  }>
>();

const fetchUnlockProgress = async (
  client: any,
  playerAddress: string
): Promise<{
  playerTier: Awaited<ReturnType<typeof getPlayerTier>>;
  unlockEntries: UnlockEntryView[];
}> => {
  const cacheKey = playerAddress.toLowerCase();
  const inFlight = unlockProgressPromiseCache.get(cacheKey);
  if (inFlight) return inFlight;

  const request = Promise.all([
    getPlayerTier(client, playerAddress),
    getUnlockList(client),
  ])
    .then(([playerTier, unlockEntries]) => ({
      playerTier,
      unlockEntries,
    }))
    .finally(() => {
      unlockProgressPromiseCache.delete(cacheKey);
    });

  unlockProgressPromiseCache.set(cacheKey, request);
  return request;
};

export const useUnlockProgressStore = create<UnlockProgressStore>((set) => ({
  ...initialState,

  refreshUnlockProgress: async (client, accountAddress) => {
    const playerAddress = getAddress(accountAddress);
    if (!client || !playerAddress) {
      set({ ...initialState });
      return;
    }

    set({
      loading: true,
      error: null,
      lastAddress: playerAddress,
    });

    try {
      const { playerTier, unlockEntries } = await fetchUnlockProgress(
        client,
        playerAddress
      );
      set({
        playerTier: playerTier.tier,
        totalRuns: playerTier.totalRuns,
        maxLevel: playerTier.maxLevel,
        maxRound: playerTier.maxRound,
        unlockEntries,
        unlockedShopItems: getUnlockedShopTooltipItems(
          unlockEntries,
          playerTier.tier
        ),
        loading: false,
        error: null,
        lastAddress: playerAddress,
        lastUpdatedAt: Date.now(),
      });
    } catch (error) {
      console.error("[unlock-progress] failed to fetch unlock progress", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
        lastAddress: playerAddress,
      });
    }
  },

  clearUnlockProgress: () => {
    set({ ...initialState });
  },
}));
