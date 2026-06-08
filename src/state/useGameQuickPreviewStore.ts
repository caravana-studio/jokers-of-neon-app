import { create } from "zustand";

export type GameQuickPreviewType = "deck" | "plays" | "missions";

interface GameQuickPreviewStore {
  activePreviewType: GameQuickPreviewType | null;
  setPreviewType: (type: GameQuickPreviewType | null) => void;
  clearPreviewType: (type?: GameQuickPreviewType) => void;
}

export const useGameQuickPreviewStore = create<GameQuickPreviewStore>(
  (set) => ({
    activePreviewType: null,
    setPreviewType: (type) => set({ activePreviewType: type }),
    clearPreviewType: (type) =>
      set((state) =>
        !type || state.activePreviewType === type
          ? { activePreviewType: null }
          : state,
      ),
  }),
);
