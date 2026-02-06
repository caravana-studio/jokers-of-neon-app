import { create } from "zustand";
import {
  getUserSkinPreferences,
  type SkinPreferences,
} from "../api/userPreferences";

type SkinPreferencesStore = {
  skinsByCardId: SkinPreferences;
  loading: boolean;
  error: string | null;
  lastUserAddress?: string;
  refetchSkinPreferences: (userAddress?: string) => Promise<void>;
  updateSkin: (cardId: string | number, skinId: number) => void;
  getSkinFor: (cardId: string | number) => number;
  reset: () => void;
};

const initialState = {
  skinsByCardId: {},
  loading: false,
  error: null,
  lastUserAddress: undefined,
};

const normalizeSkinValue = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.trunc(parsed);
};

export const useSkinPreferencesStore = create<SkinPreferencesStore>(
  (set, get) => ({
    ...initialState,
    refetchSkinPreferences: async (userAddress) => {
      if (!userAddress) {
        set(initialState);
        return;
      }

      const { loading, lastUserAddress } = get();
      if (loading && lastUserAddress === userAddress) {
        return;
      }

      set({
        loading: true,
        error: null,
        lastUserAddress: userAddress,
      });

      try {
        const skinsByCardId = await getUserSkinPreferences(userAddress);
        set({
          skinsByCardId,
          loading: false,
          error: null,
          lastUserAddress: userAddress,
        });
      } catch (error) {
        console.error("Failed to fetch skin preferences", error);
        set({
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    updateSkin: (cardId, skinId) => {
      const key = String(cardId);
      const normalizedSkin = normalizeSkinValue(skinId);
      set((state) => ({
        skinsByCardId: {
          ...state.skinsByCardId,
          [key]: normalizedSkin,
        },
      }));
    },
    getSkinFor: (cardId) => {
      const key = String(cardId);
      const stored = get().skinsByCardId[key];
      return Number.isFinite(stored) ? stored : 0;
    },
    reset: () => set(initialState),
  })
);
