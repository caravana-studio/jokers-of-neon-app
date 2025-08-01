import { create } from "zustand";
import { CLASSIC_MOD_ID } from "../constants/general";
import { GAME_ID } from "../constants/localStorage";
import { getPlayerPokerHands } from "../dojo/getPlayerPokerHands";
import { fetchCardsConfig } from "../dojo/queries/getCardsConfig";
import { getGameConfig } from "../dojo/queries/getGameConfig";
import { getGameView } from "../dojo/queries/getGameView";
import { getNode } from "../dojo/queries/getNode";
import { getPowerUps } from "../dojo/queries/getPowerUps";
import { getRageCards } from "../dojo/queries/getRageCards";
import { getSpecialCardsView } from "../dojo/queries/getSpecialCardsView";
import { GameStateEnum } from "../dojo/typescript/custom";
import { Card } from "../types/Card";
import { LevelPokerHand } from "../types/LevelPokerHand";
import { ModCardsConfig } from "../types/ModConfig";
import { PowerUp } from "../types/Powerup/PowerUp";
import { RoundRewards } from "../types/RoundRewards";
import { getRageNodeData } from "../utils/getRageNodeData";

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
  rageCards: Card[];
  specialCards: Card[];
  availableRerolls: number;
  modId: string;
  isClassic: boolean;
  isRageRound: boolean;
  maxSpecialCards: number;
  maxPowerUpSlots: number;
  powerUps: (PowerUp | null)[];
  preSelectedPowerUps: number[];
  roundRewards: RoundRewards | undefined;
  gameLoading: boolean;
  gameError: boolean;
  modCardsConfig: ModCardsConfig | undefined;
  specialSwitcherOn: boolean;
  plays: LevelPokerHand[];
  nodeRound: number;
  shopId: number;

  refetchGameStore: (client: any, gameId: number) => Promise<void>;
  setGameId: (gameId: number) => void;
  removeGameId: () => void;
  play: () => void;
  discard: () => void;
  rollbackDiscard: () => void;
  rollbackPlay: () => void;
  reroll: () => void;
  rollbackReroll: () => void;
  setCash: (cash: number) => void;
  addCash: (cash: number) => void;
  removeCash: (cash: number) => void;
  setCurrentScore: (score: number) => void;
  addPoints: (points: number) => void;
  setPoints: (points: number) => void;
  addMulti: (multi: number) => void;
  setMulti: (multi: number) => void;
  resetMultiPoints: () => void;
  resetRage: () => void;
  resetSpecials: () => void;
  setState: (state: GameStateEnum) => void;
  removeSpecialCard: (cardId: number) => void;
  preSelectPowerUp: (powerUpIdx: number) => void;
  unPreSelectPowerUp: (powerUpIdx: number) => void;
  togglePreselectedPowerUp: (powerUpIdx: number) => boolean;
  powerUpIsPreselected: (powerUpIdx: number) => boolean;
  resetPowerUps: () => void;
  addPowerUp: (powerUp: PowerUp) => void;
  setPowerUps: (powerUps: (PowerUp | null)[]) => void;
  refetchPowerUps: (client: any, gameId: number) => Promise<void>;
  refetchSpecialCards: (client: any, gameId: number) => Promise<void>;
  unPreSelectAllPowerUps: () => void;
  setRoundRewards: (rewards: RoundRewards | undefined) => void;
  setGameLoading: (loading: boolean) => void;
  setGameError: (error: boolean) => void;
  toggleSpecialSwitcher: () => void;
  showRages: () => void;
  showSpecials: () => void;
  refetchPlays: (client: any, gameId: number) => Promise<void>;
  setRound: (round: number) => void;
  addSpecialSlot: () => void;
  removeSpecialSlot: () => void;
  setShopId: (shopId: number) => void;
};

const doRefetchGameStore = async (client: any, gameId: number, set: any) => {
  console.log("refetchint game store");
  const { round, game } = await getGameView(client, gameId);
  const specialCards = await getSpecialCardsView(client, gameId);
  const rageCards = getRageCards(round.rages);
  const powerUps = await getPowerUps(client, gameId);
  const { maxPowerUpSlots, maxSpecialCards } = await getGameConfig(
    client,
    game.mod_id
  );

  const modCardsConfig = await fetchCardsConfig(client, game.mod_id);

  const plays = await getPlayerPokerHands(client, gameId);

  const nodeRoundData = await getNode(
    client,
    gameId ?? 0,
    game.current_node_id ?? 0
  );
  if (rageCards.length > 0) {
    const rageRoundData = getRageNodeData(nodeRoundData);
    set({ nodeRound: rageRoundData.round });
  } else {
    set({ nodeRound: nodeRoundData });
  }

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
    modId: game.mod_id,
    isClassic: game.mod_id === CLASSIC_MOD_ID,
    totalScore: game.player_score,
    currentScore: round.current_score,
    specialCards,
    maxSpecialCards,
    maxPowerUpSlots,
    powerUps,
    modCardsConfig,
    plays,
    shopId: nodeRoundData,
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
  state: GameStateEnum.NotSet,
  specialSlots: 1,
  rageCards: [],
  specialCards: [],
  isRageRound: false,
  availableRerolls: 0,
  modId: "jokers_of_neon_classic",
  isClassic: true,
  maxSpecialCards: 7,
  maxPowerUpSlots: 4,
  powerUps: [],
  preSelectedPowerUps: [],
  gameLoading: true,
  gameError: false,
  roundRewards: undefined,
  modCardsConfig: undefined,
  specialSwitcherOn: true,
  plays: [],
  nodeRound: 0,
  shopId: 0,

  refetchGameStore: async (client, gameId) => {
    console.log("refetchingGameStore");
    await doRefetchGameStore(client, gameId, set);
  },

  refetchSpecialCards: async (client, gameId) => {
    const specialCards = await getSpecialCardsView(client, gameId);
    set({
      specialCards,
    });
  },

  setGameId: (gameId) => {
    set({ id: gameId });
    localStorage.setItem(GAME_ID, gameId.toString());
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

  reroll: () => {
    const { availableRerolls } = get();
    set({ availableRerolls: availableRerolls - 1 });
  },

  rollbackReroll: () => {
    const { availableRerolls } = get();
    set({ availableRerolls: availableRerolls + 1 });
  },

  rollbackDiscard: () => {
    const { remainingDiscards } = get();
    set({ remainingDiscards: remainingDiscards + 1 });
  },

  rollbackPlay: () => {
    const { remainingPlays } = get();
    set({ remainingPlays: remainingPlays + 1 });
  },

  setCash: (cashToSet: number) => {
    set({ cash: cashToSet });
  },

  addCash: (cashToAdd: number) => {
    const { cash: currentCash } = get();
    console.log("currentCash", currentCash);
    console.log("cashToAdd", cashToAdd);
    console.log("new cash", currentCash + cashToAdd);
    set({ cash: currentCash + cashToAdd });
  },

  removeCash: (cashToRemove: number) => {
    const { cash: currentCash } = get();
    console.log("currentCash", currentCash);
    console.log("cashToRemove", cashToRemove);
    console.log("new cash", currentCash - cashToRemove);
    set({ cash: currentCash - cashToRemove });
  },

  setCurrentScore: (score: number) => {
    set({ currentScore: score });
  },

  setPoints: (points: number) => {
    set({ points: points });
  },

  addPoints: (points: number) => {
    const { points: currentPoints } = get();
    set({ points: currentPoints + points });
  },

  addMulti: (multi: number) => {
    const { multi: currentMulti } = get();
    set({ multi: currentMulti + multi });
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

  resetSpecials: () => {
    set({ specialCards: [] });
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

  preSelectPowerUp: (powerUpIdx: number) => {
    const { preSelectedPowerUps } = get();
    set({ preSelectedPowerUps: [...preSelectedPowerUps, powerUpIdx] });
  },
  unPreSelectPowerUp: (powerUpIdx: number) => {
    const { preSelectedPowerUps } = get();
    set({
      preSelectedPowerUps: preSelectedPowerUps.filter(
        (idx) => idx !== powerUpIdx
      ),
    });
  },

  togglePreselectedPowerUp: (powerUpIdx: number): boolean => {
    const {
      preSelectedPowerUps,
      remainingPlays,
      unPreSelectPowerUp,
      preSelectPowerUp,
      maxPowerUpSlots,
    } = get();
    if (remainingPlays > 0) {
      if (preSelectedPowerUps.includes(powerUpIdx)) {
        unPreSelectPowerUp(powerUpIdx);
        return true;
      } else if (preSelectedPowerUps.length < maxPowerUpSlots) {
        preSelectPowerUp(powerUpIdx);
        return true;
      }
    }
    return false;
  },

  powerUpIsPreselected: (powerUpIdx: number) => {
    const { preSelectedPowerUps } = get();

    return preSelectedPowerUps.filter((idx) => idx === powerUpIdx).length > 0;
  },

  resetPowerUps: () => {
    set({ powerUps: [] });
    set({ preSelectedPowerUps: [] });
  },

  unPreSelectAllPowerUps: () => {
    set({ preSelectedPowerUps: [] });
  },

  addPowerUp: (powerUp: PowerUp) => {
    set((state) => {
      if (state.powerUps.map((p) => p?.idx).includes(powerUp.idx)) return {};
      const newPowerUps = [...state.powerUps];
      newPowerUps[powerUp.idx] = powerUp;
      return { powerUps: newPowerUps };
    });
  },

  setPowerUps: (powerUps: (PowerUp | null)[]) => {
    set({ powerUps });
  },

  refetchPowerUps: async (client: any, gameId: number) => {
    const powerUps = await getPowerUps(client, gameId);
    set({ powerUps });
  },

  setGameLoading: (loading: boolean) => {
    set({ gameLoading: loading });
  },

  setGameError: (error: boolean) => {
    set({ gameError: error });
  },

  setRoundRewards: (rewards: RoundRewards | undefined) => {
    set({ roundRewards: rewards });
  },

  toggleSpecialSwitcher: () => {
    set((state) => ({ specialSwitcherOn: !state.specialSwitcherOn }));
  },

  showRages: () => {
    set({ specialSwitcherOn: false });
  },

  showSpecials: () => {
    set({ specialSwitcherOn: true });
  },

  refetchPlays: async (client, gameId) => {
    const plays = await getPlayerPokerHands(client, gameId);
    plays && set({ plays: plays as LevelPokerHand[] });
  },

  setRound: (round: number) => {
    set({ round });
  },

  addSpecialSlot: () => {
    set((state) => ({
      specialSlots: state.specialSlots + 1,
    }));
  },

  removeSpecialSlot: () => {
    set((state) => ({
      specialSlots: state.specialSlots - 1,
    }));
  },

  setShopId: (shopId) => {
    set({ shopId });
  },
}));
