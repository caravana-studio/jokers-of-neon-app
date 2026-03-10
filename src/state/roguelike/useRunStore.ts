import { create } from "zustand";
import {
  ActiveRun,
  BuyCardInput,
  EndRunInput,
  RunConfig,
  ShopState,
  ShopTabId,
} from "../../domain/roguelike/types";
import { getGameApi } from "../../gameApi/getGameApi";
import { useProgressStore } from "./useProgressStore";
import { useRoguelikeUiStore } from "./useRoguelikeUiStore";

const gameApi = getGameApi();

type RunStore = {
  activeRun: ActiveRun | null;
  shop: ShopState | null;
  loading: boolean;
  error: string | null;

  bootstrapRun: () => Promise<void>;
  startRun: (config: RunConfig) => Promise<ActiveRun | null>;
  advanceRound: () => Promise<ActiveRun | null>;
  defeatBoss: () => Promise<ActiveRun | null>;
  buyRunUpgrade: (upgradeId: string) => Promise<ActiveRun | null>;
  syncRunGold: (gold: number) => Promise<void>;
  loadShop: () => Promise<ShopState | null>;
  buyCard: (offerId: string, tab: ShopTabId) => Promise<boolean>;
  endRun: (input: EndRunInput) => Promise<boolean>;
  clearRun: () => void;
};

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
};

export const useRunStore = create<RunStore>((set, get) => ({
  activeRun: null,
  shop: null,
  loading: false,
  error: null,

  bootstrapRun: async () => {
    set({ loading: true, error: null });

    try {
      const activeRun = await gameApi.getActiveRun();
      if (!activeRun) {
        set({ activeRun: null, shop: null, loading: false, error: null });
        return;
      }

      const shop = await gameApi.getShop(activeRun.runId).catch(() => null);
      set({ activeRun, shop, loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: toErrorMessage(error) });
    }
  },

  startRun: async (config) => {
    set({ loading: true, error: null });

    try {
      const run = await gameApi.startRun(config);
      const shop = await gameApi.getShop(run.runId).catch(() => null);
      set({ activeRun: run, shop, loading: false, error: null });
      return run;
    } catch (error) {
      set({ loading: false, error: toErrorMessage(error) });
      return null;
    }
  },

  advanceRound: async () => {
    const run = get().activeRun;
    if (!run) {
      return null;
    }

    set({ loading: true, error: null });

    try {
      const updatedRun = await gameApi.advanceRound(run.runId);
      set({ activeRun: updatedRun, loading: false, error: null });
      return updatedRun;
    } catch (error) {
      set({ loading: false, error: toErrorMessage(error) });
      return null;
    }
  },

  defeatBoss: async () => {
    const run = get().activeRun;
    if (!run) {
      return null;
    }

    set({ loading: true, error: null });

    try {
      const updatedRun = await gameApi.defeatBoss(run.runId);
      set({ activeRun: updatedRun, loading: false, error: null });
      return updatedRun;
    } catch (error) {
      set({ loading: false, error: toErrorMessage(error) });
      return null;
    }
  },

  buyRunUpgrade: async (upgradeId) => {
    const run = get().activeRun;
    if (!run) {
      return null;
    }

    set({ loading: true, error: null });

    try {
      const updatedRun = await gameApi.buyRunUpgrade(run.runId, upgradeId);
      set({ activeRun: updatedRun, loading: false, error: null });
      return updatedRun;
    } catch (error) {
      set({ loading: false, error: toErrorMessage(error) });
      return null;
    }
  },

  syncRunGold: async (gold) => {
    const run = get().activeRun;
    if (!run) {
      return;
    }

    const safeGold = Math.max(0, Math.floor(gold));
    if (run.gold === safeGold) {
      return;
    }

    set({
      activeRun: {
        ...run,
        gold: safeGold,
      },
    });

    try {
      const syncedRun = await gameApi.setRunGold(run.runId, safeGold);
      set({ activeRun: syncedRun, error: null });
    } catch (error) {
      set({ error: toErrorMessage(error) });
    }
  },

  loadShop: async () => {
    const run = get().activeRun;
    if (!run) {
      set({ shop: null });
      return null;
    }

    set({ loading: true, error: null });

    try {
      const shop = await gameApi.getShop(run.runId);
      set({ shop, loading: false, error: null });
      return shop;
    } catch (error) {
      set({ loading: false, error: toErrorMessage(error) });
      return null;
    }
  },

  buyCard: async (offerId, tab) => {
    const run = get().activeRun;
    if (!run) {
      return false;
    }

    set({ loading: true, error: null });

    try {
      const input: BuyCardInput = { runId: run.runId, offerId, tab };
      const result = await gameApi.buyCard(input);
      set({
        activeRun: result.run,
        shop: result.shop,
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      set({ loading: false, error: toErrorMessage(error) });
      return false;
    }
  },

  endRun: async (input) => {
    const run = get().activeRun;
    if (!run) {
      return false;
    }

    set({ loading: true, error: null });

    try {
      const result = await gameApi.endRun(run.runId, input);

      useProgressStore.getState().hydrateProgress(result.progress);
      if (result.awardedUnlock) {
        useRoguelikeUiStore.getState().openUnlockModal(result.awardedUnlock);
      }

      set({ activeRun: null, shop: null, loading: false, error: null });
      return true;
    } catch (error) {
      set({ loading: false, error: toErrorMessage(error) });
      return false;
    }
  },

  clearRun: () => {
    set({ activeRun: null, shop: null, error: null });
  },
}));
