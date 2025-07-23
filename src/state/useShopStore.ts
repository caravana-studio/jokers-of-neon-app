import { create } from "zustand";
import { getShopItems } from "../dojo/queries/getShopItems";
import {
  BlisterPackItem,
  BurnItem,
  SlotSpecialCardsItem,
} from "../dojo/typescript/models.gen";
import { Card } from "../types/Card";
import { PokerHandItem } from "../types/PokerHandItem";
import { PowerUp } from "../types/Powerup/PowerUp";

const sortByCardId = (a: Card, b: Card) => (a.card_id ?? 0) - (b.card_id ?? 0);
const sortByPackId = (a: BlisterPackItem, b: BlisterPackItem) =>
  (Number(a.blister_pack_id) ?? 0) - (Number(b.blister_pack_id) ?? 0);
const sortByPokerHand = (a: PokerHandItem, b: PokerHandItem) =>
  a.poker_hand.localeCompare(b.poker_hand);
const sortByPowerUpId = (a: PowerUp, b: PowerUp) =>
  (Number(a.power_up_id) ?? 0) - (Number(b.power_up_id) ?? 0);

type ShopStore = {
  specialCards: Card[];
  modifierCards: Card[];
  commonCards: Card[];
  pokerHandItems: PokerHandItem[];
  packs: BlisterPackItem[];
  specialSlotItem: SlotSpecialCardsItem | null;
  burnItem: BurnItem | null;
  powerUps: PowerUp[];
  cash: number;
  loading: boolean;
  rerolling: boolean;
  locked: boolean;

  refetchShopStore: (client: any, gameId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setRerolling: (rerolling: boolean) => void;
  setLocked: (locked: boolean) => void;

  buySpecialCard: (idx: number) => void;
  rollbackBuySpecialCard: (idx: number) => void;
  buyModifierCard: (idx: number) => void;
  rollbackBuyModifierCard: (idx: number) => void;
  buyCommonCard: (idx: number) => void;
  rollbackBuyCommonCard: (idx: number) => void;
  buyPokerHand: (idx: number) => void;
  rollbackBuyPokerHand: (idx: number) => void;
  buyBlisterPack: (idx: number) => void;
  rollbackBuyBlisterPack: (idx: number) => void;
  buyPowerUp: (idx: number) => void;
  rollbackBuyPowerUp: (idx: number) => void;
  buySlotSpecialCard: () => void;
  rollbackBuySlotSpecialCard: () => void;
};

function getCost(item: any): number {
  return item.price ?? item.cost_discount ?? item.cost ?? 0;
}

function updateList<T extends { idx: number; purchased?: boolean }>(
  list: T[],
  idx: number,
  updateFn: (item: T) => T
): T[] {
  return list.map((item) => (item.idx === idx ? updateFn(item) : item));
}

export const useShopStore = create<ShopStore>((set, get) => ({
  specialCards: [],
  modifierCards: [],
  commonCards: [],
  pokerHandItems: [],
  packs: [],
  specialSlotItem: null,
  burnItem: null,
  powerUps: [],
  cash: 0,
  loading: true,
  rerolling: false,
  locked: false,

  refetchShopStore: async (client, gameId) => {
    const shopItems = await getShopItems(client, gameId);
    if (shopItems) {
      set({
        specialCards: shopItems.specialCards.sort(sortByCardId),
        modifierCards: shopItems.modifierCards.sort(sortByCardId),
        commonCards: shopItems.commonCards.sort(sortByCardId),
        pokerHandItems: shopItems.pokerHandItems.sort(sortByPokerHand),
        packs: shopItems.packs.sort(sortByPackId),
        specialSlotItem: shopItems.specialSlotItem,
        burnItem: shopItems.burnItem,
        powerUps: shopItems.powerUpItems.sort(sortByPowerUpId),
        cash: shopItems.cash,
        loading: false,
      });
    }
  },

  setRerolling: (rerolling: boolean) => set({ rerolling }),

  buySpecialCard: (idx) =>
    set((state) => {
      const item = state.specialCards.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash - cost,
        specialCards: updateList(state.specialCards, idx, (i) => ({
          ...i,
          purchased: true,
        })),
      };
    }),

  rollbackBuySpecialCard: (idx) =>
    set((state) => {
      const item = state.specialCards.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash + cost,
        specialCards: updateList(state.specialCards, idx, (i) => ({
          ...i,
          purchased: false,
        })),
      };
    }),

  buyModifierCard: (idx) =>
    set((state) => {
      const item = state.modifierCards.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash - cost,
        modifierCards: updateList(state.modifierCards, idx, (i) => ({
          ...i,
          purchased: true,
        })),
      };
    }),

  rollbackBuyModifierCard: (idx) =>
    set((state) => {
      const item = state.modifierCards.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash + cost,
        modifierCards: updateList(state.modifierCards, idx, (i) => ({
          ...i,
          purchased: false,
        })),
      };
    }),

  buyCommonCard: (idx) =>
    set((state) => {
      const item = state.commonCards.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash - cost,
        commonCards: updateList(state.commonCards, idx, (i) => ({
          ...i,
          purchased: true,
        })),
      };
    }),

  rollbackBuyCommonCard: (idx) =>
    set((state) => {
      const item = state.commonCards.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash + cost,
        commonCards: updateList(state.commonCards, idx, (i) => ({
          ...i,
          purchased: false,
        })),
      };
    }),

  buyPokerHand: (idx) =>
    set((state) => {
      const item = state.pokerHandItems.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash - cost,
        pokerHandItems: updateList(state.pokerHandItems, idx, (i) => ({
          ...i,
          purchased: true,
        })),
      };
    }),

  rollbackBuyPokerHand: (idx) =>
    set((state) => {
      const item = state.pokerHandItems.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash + cost,
        pokerHandItems: updateList(state.pokerHandItems, idx, (i) => ({
          ...i,
          purchased: false,
        })),
      };
    }),

  buyBlisterPack: (idx) =>
    set((state) => {
      const item = state.packs.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash - cost,
        packs: updateList(state.packs, idx, (i) => ({
          ...i,
          purchased: true,
        })),
      };
    }),

  rollbackBuyBlisterPack: (idx) =>
    set((state) => {
      const item = state.packs.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash + cost,
        packs: updateList(state.packs, idx, (i) => ({
          ...i,
          purchased: false,
        })),
      };
    }),

  buyPowerUp: (idx) =>
    set((state) => {
      const item = state.powerUps.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash - cost,
        powerUps: updateList(state.powerUps, idx, (i) => ({
          ...i,
          purchased: true,
        })),
      };
    }),

  rollbackBuyPowerUp: (idx) =>
    set((state) => {
      const item = state.powerUps.find((i) => i.idx === idx);
      const cost = getCost(item);
      return {
        cash: state.cash + cost,
        powerUps: updateList(state.powerUps, idx, (i) => ({
          ...i,
          purchased: false,
        })),
      };
    }),

  buySlotSpecialCard: () =>
    set((state) => {
      const cost = getCost(state.specialSlotItem);
      return {
        cash: state.cash - cost,
        specialSlotItem: state.specialSlotItem
          ? { ...state.specialSlotItem, purchased: true }
          : null,
      };
    }),

  rollbackBuySlotSpecialCard: () =>
    set((state) => {
      const cost = getCost(state.specialSlotItem);
      return {
        cash: state.cash + cost,
        specialSlotItem: state.specialSlotItem
          ? { ...state.specialSlotItem, purchased: false }
          : null,
      };
    }),

  setLocked: (locked: boolean) => set({ locked }),

  setLoading: (loading: boolean) => set({ loading }),
}));
