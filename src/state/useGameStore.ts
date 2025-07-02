import { create } from "zustand";
import { CLASSIC_MOD_ID } from "../constants/general";
import { GAME_ID } from "../constants/localStorage";
import { getGameView } from "../dojo/queries/getGameView";
import { getRageCards } from "../dojo/queries/getRageCards";
import { getSpecialCardsView } from "../dojo/queries/getSpecialCardsView";
import { GameStateEnum } from "../dojo/typescript/custom";
import { Card } from "../types/Card";

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
  rageCards: Card[];
  specialCards: Card[];
  availableRerolls: number;
  modId: string;
  isClassic: boolean;
  isRageRound: boolean;
  refetchGameStore: (client: any, gameId: number) => Promise<void>;
  setGameId: (client: any, gameId: number) => void;
  removeGameId: () => void;
  play: () => void;
  discard: () => void;
  rollbackDiscard: () => void;
  rollbackPlay: () => void;
  addCash: (cash: number) => void;
  setCurrentScore: (score: number) => void;
  addPoints: (points: number) => void;
  setPoints: (points: number) => void;
  addMulti: (multi: number) => void;
  setMulti: (multi: number) => void;
  resetMultiPoints: () => void;
  resetRage: () => void;
  setState: (state: GameStateEnum) => void;
  removeSpecialCard: (cardId: number) => void;
};

const doRefetchGameStore = async (client: any, gameId: number, set: any) => {
  console.log("refetchint game store");
  const { round, game } = await getGameView(client, gameId);
  const specialCards = await getSpecialCardsView(client, gameId);
  const rageCards = getRageCards(round.rages);
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
    rageCards,
    isRageRound: rageCards.length > 0,
    availableRerolls: game.available_rerolls,
    specialsLength: game.current_specials_len,
    modId: game.mod_id,
    isClassic: game.mod_id === CLASSIC_MOD_ID,
    totalScore: game.player_score,
    currentScore: round.current_score,
    specialCards,
  });
};

export const useGameStore = create<GameStore>((set, get) => ({
  id: Number(localStorage.getItem(GAME_ID)) ?? 0,
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
  specialCards: [],
  isRageRound: false,
  availableRerolls: 0,
  specialsLength: 0,
  modId: "jokers_of_neon_classic",
  isClassic: true,

  refetchGameStore: async (client, gameId) => {
    doRefetchGameStore(client, gameId, set);
  },

  setGameId: (client, gameId) => {
    set({ id: gameId });
    localStorage.setItem(GAME_ID, gameId.toString());
    doRefetchGameStore(client, gameId, set);
  },

  removeGameId: () => {
    localStorage.removeItem(GAME_ID);
    set({ id: 0 });
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

  rollbackPlay: () => {
    const { remainingPlays } = get();
    set({ remainingPlays: remainingPlays + 1 });
  },

  addCash: (cashToAdd: number) => {
    const { cash: currentCash } = get();
    set({ cash: currentCash + cashToAdd });
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

  resetRage: () => {
    set({ isRageRound: false, rageCards: [] });
  },

  setState: (state: GameStateEnum) => {
    set({ state });
  },

  removeSpecialCard: (cardId: number) => {
    set((state) => {
      const newState = { ...state };
      newState.specialCards = newState.specialCards.filter(
        (card) => card.card_id !== cardId
      );
      return newState;
    });
  },
}));
