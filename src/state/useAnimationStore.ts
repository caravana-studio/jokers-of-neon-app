import { create } from "zustand";

type AnimationStore = {
  playAnimation: boolean;
  setPlayAnimation: (playing: boolean) => void;
  discardAnimation: boolean;
  setDiscardAnimation: (playing: boolean) => void;
  destroyedSpecialCardId: number | undefined;
  setDestroyedSpecialCardId: (id: number | undefined) => void;
};

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  playAnimation: false,
  setPlayAnimation: (playing: boolean) => {
    set({ playAnimation: playing });
  },
  discardAnimation: false,
  setDiscardAnimation: (playing: boolean) => {
    set({ discardAnimation: playing });
  },
  destroyedSpecialCardId: undefined,
  setDestroyedSpecialCardId: (id: number | undefined) => {
    set({ destroyedSpecialCardId: id });
  },
}));
