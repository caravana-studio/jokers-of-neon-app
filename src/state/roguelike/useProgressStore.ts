import { create } from "zustand";
import {
  arePactsEnabled,
  getAvailableShopTabs,
  isPrepareRunUnlocked,
  isSystemUnlocked,
} from "../../domain/roguelike/selectors";
import {
  ProfileProgress,
  QueuedUnlock,
  ShopTabId,
  UnlockableSystem,
} from "../../domain/roguelike/types";
import { getGameApi } from "../../gameApi/getGameApi";

const gameApi = getGameApi();

type ProgressStore = {
  profile: ProfileProgress | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  bootstrap: () => Promise<void>;
  refreshProgress: () => Promise<ProfileProgress | null>;
  hydrateProgress: (profile: ProfileProgress) => void;

  isSystemEnabled: (system: UnlockableSystem) => boolean;
  getEnabledShopTabs: () => ShopTabId[];
  isPrepareRunEnabled: () => boolean;
  arePactsAvailable: () => boolean;

  peekNextUnlock: () => Promise<QueuedUnlock | null>;
  consumeNextUnlock: () => Promise<QueuedUnlock | null>;
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  profile: null,
  loading: false,
  initialized: false,
  error: null,

  bootstrap: async () => {
    if (get().initialized) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const profile = await gameApi.getProgress();
      set({ profile, initialized: true, loading: false, error: null });
    } catch (error) {
      set({
        loading: false,
        initialized: true,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  refreshProgress: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await gameApi.getProgress();
      set({ profile, initialized: true, loading: false, error: null });
      return profile;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  },

  hydrateProgress: (profile) => {
    set({ profile, loading: false, initialized: true, error: null });
  },

  isSystemEnabled: (system) => {
    const profile = get().profile;
    if (!profile) {
      return false;
    }

    return isSystemUnlocked(profile.unlockedSystems, system);
  },

  getEnabledShopTabs: () => {
    const profile = get().profile;
    if (!profile) {
      return ["DECK"];
    }

    return getAvailableShopTabs(profile.unlockedSystems);
  },

  isPrepareRunEnabled: () => {
    const profile = get().profile;
    if (!profile) {
      return false;
    }

    return isPrepareRunUnlocked(profile.unlockedSystems);
  },

  arePactsAvailable: () => {
    const profile = get().profile;
    if (!profile) {
      return false;
    }

    return arePactsEnabled(profile.unlockedSystems);
  },

  peekNextUnlock: async () => {
    return gameApi.peekNextUnlock();
  },

  consumeNextUnlock: async () => {
    const consumed = await gameApi.consumeNextUnlock();
    if (!consumed) {
      return null;
    }

    const profile = await gameApi.getProgress();
    set({ profile, initialized: true, loading: false, error: null });
    return consumed;
  },
}));
