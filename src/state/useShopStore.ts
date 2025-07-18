import { create } from "zustand";
import { getShopItems } from "../dojo/queries/getShopItems";
import {
  BlisterPackItem,
  BurnItem,
  SlotSpecialCardsItem,
} from "../dojo/typescript/models.gen";
import { PokerHandItem } from "../types/PokerHandItem";

import { Card } from "../types/Card";
import { PowerUp } from "../types/Powerup/PowerUp";

const sortByCardId = (a: Card, b: Card) => {
  return (a.card_id ?? 0) - (b.card_id ?? 0);
};
const sortByPackId = (a: BlisterPackItem, b: BlisterPackItem) => {
  return (Number(a.blister_pack_id) ?? 0) - (Number(b.blister_pack_id) ?? 0);
};
const sortByPokerHand = (a: PokerHandItem, b: PokerHandItem) => {
  return a.poker_hand.localeCompare(b.poker_hand);
};

const sortByPowerUpId = (a: PowerUp, b: PowerUp) => {
  return (Number(a.power_up_id) ?? 0) - (Number(b.power_up_id) ?? 0);
};

type ShopStore = {
  specialCards: Card[];
  modifierCards: Card[];
  commonCards: Card[];
  pokerHandItems: PokerHandItem[];
  packs: BlisterPackItem[];
  specialSlotItem: SlotSpecialCardsItem | null;
  burnItem: BurnItem | null;
  powerUps: PowerUp[];
  loading: boolean;

  refetchShopStore: (client: any, gameId: number) => Promise<void>;
};

export const useShopStore = create<ShopStore>((set, get) => ({
  specialCards: [],
  modifierCards: [],
  commonCards: [],
  pokerHandItems: [],
  packs: [],
  specialSlotItem: null,
  burnItem: null,
  powerUps: [],
  loading: true,

  refetchShopStore: async (client, gameId) => {
    const shopItems = await getShopItems(client, gameId);
    set({
      loading: false,
    });
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
      });
    }
  },
}));
