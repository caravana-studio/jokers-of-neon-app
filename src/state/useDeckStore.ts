import { create } from "zustand";
import { DeckCard, getDeck } from "../dojo/queries/getDeck";
import { getCardFromCardId } from "../dojo/utils/getCardFromCardId";
import { CardTypes } from "../enums/cardTypes";
import { Card } from "../types/Card";
import { CardData } from "../types/CardData";

interface UsedCard {
  card: Card;
  used: boolean;
}

type DeckStore = {
  size: number;
  currentLength: number;
  fullDeckCards: Card[];
  usedCards: Card[];
  unusedCards: Card[];

  fetchDeck: (
    client: any,
    gameId: number,
    getCardData: (id: number) => CardData
  ) => Promise<void>;
};

export const useDeckStore = create<DeckStore>((set, get) => ({
  size: 0,
  currentLength: 0,
  fullDeckCards: [],
  usedCards: [],
  unusedCards: [],

  fetchDeck: async (client, gameId, getCardData) => {
    const deckData = await getDeck(client, gameId);
    const deck = deckData.map((c: DeckCard, index: number) => {
      const cardData = getCardData(c.card_id);
      const card = getCardFromCardId(c.card_id, index);
      const isNeonCard = cardData.type === CardTypes.NEON;
      return {
        card: {
          ...card,
          ...cardData,
          isNeon: isNeonCard,
        },
        used: c.used,
      };
    });
    set({
      size: deckData.length,
      currentLength: deckData.filter((c: DeckCard) => !c.used).length,
      fullDeckCards: deck.map((c: UsedCard) => c.card),
      usedCards: deck
        .filter((c: UsedCard) => c.used)
        .map((c: UsedCard) => c.card),
      unusedCards: deck
        .filter((c: UsedCard) => !c.used)
        .map((c: UsedCard) => c.card),
    });
  },

}));
