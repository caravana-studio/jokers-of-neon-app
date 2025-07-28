import { create } from "zustand";
import { LevelUpPlayEvent } from "../utils/discardEvents/getLevelUpPlayEvent";

type AnimationStore = {
  playAnimation: boolean;
  setPlayAnimation: (playing: boolean) => void;
  discardAnimation: boolean;
  setDiscardAnimation: (playing: boolean) => void;
  destroyedSpecialCardId: number | undefined;
  setDestroyedSpecialCardId: (id: number | undefined) => void;
  levelUpHand: LevelUpPlayEvent | undefined;
  setLevelUpHand: (event: LevelUpPlayEvent | undefined) => void;
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
  levelUpHand: undefined,
  setLevelUpHand: (event: LevelUpPlayEvent | undefined) => {
    set({ levelUpHand: event });
  },
}));
