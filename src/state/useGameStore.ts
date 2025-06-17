import { create } from "zustand";
import { getGameView } from "../dojo/queries/getGameView";
import { GameStateEnum } from "../dojo/typescript/custom";

type GameStore = {
  id: number;
  totalPlays: number;
  totalDiscards: number;
  remainingPlays: number;
  remainingDiscards: number;
  cash: number;
  totalScore: number;
  currentScore: number;
  points: number;
  multi: number;
  level: number;
  round: number;
  targetScore: number;
  state: GameStateEnum;
  specialSlots: number;
  specialsLength: number;
  // TODO: update this
  rageCards: any[];
  availableRerolls: number;
  modId: string;
  refetchGameStore: (client: any, gameId: number) => Promise<void>;
  play: () => void;
  discard: () => void;
  rollbackDiscard: () => void;
  addCash: (cash: number) => void;
  setCurrentScore: (score: number) => void;
  addPoints: (points: number) => void;
  setPoints: (points: number) => void;
  addMulti: (multi: number) => void;
  setMulti: (multi: number) => void;
  resetMultiPoints: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  id: 0,
  totalDiscards: 0,
  totalPlays: 0,
  remainingPlays: 0,
  remainingDiscards: 0,
  cash: 0,
  totalScore: 0,
  currentScore: 0,
  points: 0,
  multi: 0,
  level: 0,
  round: 0,
  targetScore: 0,
  state: GameStateEnum.NotStarted,
  specialSlots: 1,
  rageCards: [],
  availableRerolls: 0,
  specialsLength: 0,
  modId: "jokers_of_neon_classic",

  refetchGameStore: async (client, gameId) => {
    console.log("refetchint game store");
    const { round, game } = await getGameView(client, gameId);
    set({
      id: gameId,
      totalDiscards: game.discards,
      totalPlays: game.plays,
      remainingPlays: round.remaining_plays,
      remainingDiscards: round.remaining_discards,
      cash: game.cash,
      level: game.level,
      round: game.current_node_id,
      targetScore: round.target_score,
      state: game.state,
      specialSlots: game.special_slots,
      rageCards: round.rages,
      availableRerolls: game.available_rerolls,
      specialsLength: game.current_specials_len,
      modId: game.mod_id,
    });
  },

  play: () => {
    const { remainingPlays } = get();
    if (remainingPlays > 0) set({ remainingPlays: remainingPlays - 1 });
  },

  discard: () => {
    const { remainingDiscards } = get();
    if (remainingDiscards > 0)
      set({ remainingDiscards: remainingDiscards - 1 });
  },

  rollbackDiscard: () => {
    const { remainingDiscards } = get();
    set({ remainingDiscards: remainingDiscards + 1 });
  },

  addCash: (cash: number) => {
    set({ cash: cash + cash });
  },

  setCurrentScore: (score: number) => {
    set({ currentScore: score });
  },

  setPoints: (points: number) => {
    set({ points: points });
  },

  addPoints: (points: number) => {
    set({ points: points + points });
  },

  addMulti: (multi: number) => {
    set({ multi: multi + multi });
  },

  setMulti: (multi: number) => {
    set({ multi: multi });
  },

  resetMultiPoints: () => {
    set({ points: 0 });
    set({ multi: 0 });
  },
}));
