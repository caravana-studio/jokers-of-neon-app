import { create } from "zustand";
import { LevelUpPlayEvent } from "../types/ScoreData";

type AnimationStore = {
  playAnimation: boolean;
  setPlayAnimation: (playing: boolean) => void;
  discardAnimation: boolean;
  setDiscardAnimation: (playing: boolean) => void;
  highlightedHandCardIndexes: number[];
  setHighlightedHandCardIndexes: (indexes: number[]) => void;
  discardingHandCardIndexes: number[];
  setDiscardingHandCardIndexes: (indexes: number[]) => void;
  playRollbackPulseToken: number;
  discardRollbackPulseToken: number;
  playRollbackPulseDurationMs: number;
  discardRollbackPulseDurationMs: number;
  triggerPlayRollbackPulse: (durationMs?: number) => void;
  triggerDiscardRollbackPulse: (durationMs?: number) => void;
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
  highlightedHandCardIndexes: [],
  setHighlightedHandCardIndexes: (indexes: number[]) => {
    set({ highlightedHandCardIndexes: indexes });
  },
  discardingHandCardIndexes: [],
  setDiscardingHandCardIndexes: (indexes: number[]) => {
    set({ discardingHandCardIndexes: indexes });
  },
  playRollbackPulseToken: 0,
  discardRollbackPulseToken: 0,
  playRollbackPulseDurationMs: 750,
  discardRollbackPulseDurationMs: 750,
  triggerPlayRollbackPulse: (durationMs = 750) => {
    const { playRollbackPulseToken } = get();
    set({
      playRollbackPulseToken: playRollbackPulseToken + 1,
      playRollbackPulseDurationMs: durationMs,
    });
  },
  triggerDiscardRollbackPulse: (durationMs = 750) => {
    const { discardRollbackPulseToken } = get();
    set({
      discardRollbackPulseToken: discardRollbackPulseToken + 1,
      discardRollbackPulseDurationMs: durationMs,
    });
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
