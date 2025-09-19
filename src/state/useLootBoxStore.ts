import { create } from "zustand";
import { getLootBoxResult } from "../dojo/queries/getLootBoxResult";
import { Card } from "../types/Card";

type LootBoxStore = {
  result: Card[];
  cardsToKeep: Card[];

  fetchLootBoxResult: (client: any, gameId: number, getCardData: (cardId: number) => any) => Promise<void>;
  toggleCard: (card: Card) => void;
  reset: () => void;
  selectAll: () => void;
  selectNone: () => void;
};

export const useLootBoxStore = create<LootBoxStore>((set, get) => ({
  result: [],
  cardsToKeep: [],

  fetchLootBoxResult: async (client, gameId, getCardData) => {
    const rawResult = await getLootBoxResult(client, gameId);
    const result = rawResult.map((card: any) => {
    const { type } = getCardData(card.card_id); 
    return {
      ...card,
      type, 
    };
  });

    set({ result, cardsToKeep: result });
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
