import { create } from "zustand";
import { getLootBoxResult } from "../dojo/queries/getLootBoxResult";
import { Card } from "../types/Card";

type LootBoxStore = {
  result: Card[];
  cardsToKeep: Card[];

  fetchLootBoxResult: (client: any, gameId: number) => Promise<void>;
  toggleCard: (card: Card) => void;
  reset: () => void;
  selectAll: () => void;
  selectNone: () => void;
};

export const useLootBoxStore = create<LootBoxStore>((set, get) => ({
  result: [],
  cardsToKeep: [],

  fetchLootBoxResult: async (client, gameId) => {
    const result = await getLootBoxResult(client, gameId);
    set({ result });
  },

  toggleCard: (card: Card) => {
    const exists = get().cardsToKeep.some((c) => c.idx === card.idx);
    set((state) => {
      const newCardsToKeep = exists
        ? get().cardsToKeep.filter((c) => c.idx !== card.idx)
        : [...get().cardsToKeep, card];
      return { cardsToKeep: newCardsToKeep };
    });
  },

  reset: () => {
    set({ result: [], cardsToKeep: [] });
  },

  selectAll: () => {
    set({ cardsToKeep: get().result });
  },

  selectNone: () => {
    set({ cardsToKeep: [] });
  },
}));
