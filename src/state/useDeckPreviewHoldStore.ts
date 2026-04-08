import { create } from "zustand";

interface DeckPreviewHoldStore {
  isDeckPreviewVisible: boolean;
  setDeckPreviewVisible: (visible: boolean) => void;
}

export const useDeckPreviewHoldStore = create<DeckPreviewHoldStore>((set) => ({
  isDeckPreviewVisible: false,
  setDeckPreviewVisible: (visible: boolean) =>
    set({ isDeckPreviewVisible: visible }),
}));

