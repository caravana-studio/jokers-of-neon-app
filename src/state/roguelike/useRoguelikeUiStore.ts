import { create } from "zustand";
import { QueuedUnlock } from "../../domain/roguelike/types";

type RoguelikeUiStore = {
  unlockModalOpen: boolean;
  unlockToShow: QueuedUnlock | null;

  openUnlockModal: (unlock: QueuedUnlock) => void;
  closeUnlockModal: () => void;
  clearUnlock: () => void;
};

export const useRoguelikeUiStore = create<RoguelikeUiStore>((set) => ({
  unlockModalOpen: false,
  unlockToShow: null,

  openUnlockModal: (unlock) => {
    set({ unlockModalOpen: true, unlockToShow: unlock });
  },

  closeUnlockModal: () => {
    set({ unlockModalOpen: false });
  },

  clearUnlock: () => {
    set({ unlockModalOpen: false, unlockToShow: null });
  },
}));
