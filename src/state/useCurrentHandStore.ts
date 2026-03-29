import { create } from "zustand";
import { SORT_BY_SUIT } from "../constants/localStorage";
import { rageCardIds } from "../constants/rageCardIds";
import { getHandCards } from "../dojo/queries/getHandCards";
import { Plays } from "../enums/plays";
import { SortBy } from "../enums/sortBy";
import { Suits } from "../enums/suits";
import { Card } from "../types/Card";
import { CardPlayEventValue } from "../types/ScoreData";
import { CARDS_SUIT_DATA } from "../data/traditionalCards";
import { changeCardNeon } from "../utils/cardTransformation/changeCardNeon";
import { changeCardSuit } from "../utils/cardTransformation/changeCardSuit";
import { sortCards } from "../utils/sortCards";
import { datadogRum } from "../monitoring/datadogRum";

type CurrentHandStore = {
  hand: Card[];
  sortBy: SortBy;
  preSelectedCards: number[];
  preSelectedModifiers: { [key: number]: number[] };
  preSelectionLocked: boolean;
  preSelectedPlay: Plays;
  maxPreSelectedCards: number;
  playIsNeon: boolean;
  cardTransformationLock: boolean;

  setPreSelectedPlay: (plays: Plays) => void;
  refetchCurrentHandStore: (client: any, gameId: number) => Promise<void>;
  replaceCards: (cards: Card[]) => void;
  toggleSortBy: () => void;
  unPreSelectCard: (cardIndex: number) => void;
  preSelectCard: (cardIndex: number) => void;
  togglePreselected: (cardIndex: number) => boolean;
  cardIsPreselected: (cardIndex: number) => boolean;
  getModifiers: (preSelectedCardIndex: number) => Card[];
  clearPreSelection: () => void;
  setPreSelectionLocked: (locked: boolean) => void;
  syncMaxPreSelectedCards: (rageCards: Card[]) => void;
  changeCardsSuit: (cardIndexes: number[], suit: Suits) => void;
  changeCardsNeon: (cardIndexes: number[]) => void;
  changeCardsRank: (cardChanges: CardPlayEventValue[]) => void;
  addModifier: (cardIdx: number, modifierIdx: number) => void;
  setPlayIsNeon: (isNeon: boolean) => void;
  setCardTransformationLock: (locked: boolean) => void;
};

const MAX_PRESELECTED_CARDS = 5;
const reportedMissingModifierReferences = new Set<string>();

const filterInvalidCards = (cards: Card[]) => {
  return cards.filter((card) => card.card_id !== 9999);
};

const sanitizePreselectedState = (
  hand: Card[],
  preSelectedCards: number[],
  preSelectedModifiers: { [key: number]: number[] }
) => {
  const validCardIndexes = new Set(hand.map((card) => card.idx));
  const nextPreSelectedCards = preSelectedCards.filter((idx) =>
    validCardIndexes.has(idx)
  );

  const nextPreSelectedModifiers: { [key: number]: number[] } = {};
  let removedReferences = 0;

  Object.entries(preSelectedModifiers).forEach(([cardIdx, modifierIndexes]) => {
    const parsedCardIdx = Number(cardIdx);
    if (!validCardIndexes.has(parsedCardIdx)) {
      removedReferences += modifierIndexes.length;
      return;
    }

    const nextModifierIndexes = modifierIndexes.filter((modifierIdx) =>
      validCardIndexes.has(modifierIdx)
    );
    removedReferences += modifierIndexes.length - nextModifierIndexes.length;

    if (nextModifierIndexes.length > 0) {
      nextPreSelectedModifiers[parsedCardIdx] = nextModifierIndexes;
    }
  });

  return {
    nextPreSelectedCards,
    nextPreSelectedModifiers,
    removedReferences,
  };
};

export const useCurrentHandStore = create<CurrentHandStore>((set, get) => ({
  hand: [],
  preSelectedCards: [],
  preSelectedModifiers: {},
  preSelectionLocked: false,
  preSelectedPlay: Plays.NONE,
  sortBy:
    localStorage.getItem(SORT_BY_SUIT) === "true" ? SortBy.SUIT : SortBy.RANK,
  maxPreSelectedCards: MAX_PRESELECTED_CARDS,
  playIsNeon: false,
  cardTransformationLock: false,

  refetchCurrentHandStore: async (client, gameId) => {
    const { sortBy, preSelectedCards, preSelectedModifiers } = get();
    const hand = await getHandCards(client, gameId, sortBy);
    const filteredHand = filterInvalidCards(hand);
    const {
      nextPreSelectedCards,
      nextPreSelectedModifiers,
      removedReferences,
    } = sanitizePreselectedState(
      filteredHand,
      preSelectedCards,
      preSelectedModifiers
    );

    if (removedReferences > 0) {
      datadogRum.addAction("game.preselection_sanitized_on_refetch", {
        removedReferences,
        gameId,
      });
    }

    set({
      hand: filteredHand,
      preSelectedCards: nextPreSelectedCards,
      preSelectedModifiers: nextPreSelectedModifiers,
    });
    set({ maxPreSelectedCards: MAX_PRESELECTED_CARDS });
  },

  replaceCards: (cards: Card[]) => {
    const { sortBy, preSelectedCards, preSelectedModifiers } = get();
    const nextHand = sortCards(filterInvalidCards(cards), sortBy);
    const {
      nextPreSelectedCards,
      nextPreSelectedModifiers,
      removedReferences,
    } = sanitizePreselectedState(
      nextHand,
      preSelectedCards,
      preSelectedModifiers
    );

    if (removedReferences > 0) {
      datadogRum.addAction("game.preselection_sanitized_on_replace_cards", {
        removedReferences,
      });
    }

    set({
      hand: nextHand,
      preSelectedCards: nextPreSelectedCards,
      preSelectedModifiers: nextPreSelectedModifiers,
    });
  },

  toggleSortBy: () => {
    const { hand } = get();
    if (get().sortBy === SortBy.SUIT) {
      localStorage.removeItem(SORT_BY_SUIT);
      set({ sortBy: SortBy.RANK });
      set({ hand: sortCards(hand, SortBy.RANK) });
    } else {
      localStorage.setItem(SORT_BY_SUIT, "true");
      set({ sortBy: SortBy.SUIT });
      set({ hand: sortCards(hand, SortBy.SUIT) });
    }
  },

  unPreSelectCard: (cardIndex: number) => {
    const { preSelectedCards, preSelectedModifiers } = get();
    set({
      preSelectedCards: preSelectedCards.filter((idx) => idx !== cardIndex),
      preSelectedModifiers: {
        ...preSelectedModifiers,
        [cardIndex]: [],
      },
    });
  },

  preSelectCard: (cardIndex: number) => {
    const { preSelectedCards } = get();
    if (
      !preSelectedCards.includes(cardIndex) &&
      preSelectedCards.length < MAX_PRESELECTED_CARDS
    ) {
      set({
        preSelectedCards: [...preSelectedCards, cardIndex],
      });
    }
  },

  togglePreselected: (cardIndex: number) => {
    const {
      preSelectedCards,
      preSelectionLocked,
      cardIsPreselected,
      unPreSelectCard,
      maxPreSelectedCards,
      preSelectCard,
    } = get();
    if (!preSelectionLocked) {
      if (cardIsPreselected(cardIndex)) {
        unPreSelectCard(cardIndex);
        return true;
      } else if (preSelectedCards.length < maxPreSelectedCards) {
        preSelectCard(cardIndex);
        return true;
      }
    }
    return false;
  },

  cardIsPreselected: (cardIndex: number) => {
    return get().preSelectedCards.filter((idx) => idx === cardIndex).length > 0;
  },

  setPreSelectedPlay: (play: Plays) => {
    set({ preSelectedPlay: play });
  },

  getModifiers: (preSelectedCardIndex: number) => {
    const { preSelectedModifiers, hand } = get();
    const modifierIndexes = preSelectedModifiers[preSelectedCardIndex] ?? [];
    const handByIdx = new Map(hand.map((card) => [card.idx, card]));
    const modifiers: Card[] = [];

    modifierIndexes.forEach((modifierIdx) => {
      const modifierCard = handByIdx.get(modifierIdx);
      if (modifierCard) {
        modifiers.push(modifierCard);
        return;
      }

      const reportKey = `${preSelectedCardIndex}:${modifierIdx}`;
      if (!reportedMissingModifierReferences.has(reportKey)) {
        reportedMissingModifierReferences.add(reportKey);
        datadogRum.addAction("game.missing_modifier_reference", {
          preSelectedCardIndex,
          modifierIdx,
          handSize: hand.length,
        });
      }
    });

    return modifiers;
  },

  clearPreSelection: () => {
    set({
      preSelectedCards: [],
      preSelectedModifiers: {},
      preSelectedPlay: Plays.NONE,
    });
  },

  setPreSelectionLocked: (locked: boolean) => {
    set({ preSelectionLocked: locked });
  },

  syncMaxPreSelectedCards: (rageCards: Card[]) => {
    const hasStrategicQuartet = rageCards.some(
      (card) => card.card_id === rageCardIds.STRATEGIC_QUARTET
    );
    set({ maxPreSelectedCards: hasStrategicQuartet ? 4 : 5 });
  },

  changeCardsSuit: (cardIndexes: number[], suit: Suits) => {
    set((state) => {
      const newHand = state.hand.map((card) => {
        if (cardIndexes.includes(card.idx) && card.suit !== Suits.WILDCARD) {
          return {
            ...card,
            card_id: changeCardSuit(card.card_id!, suit),
            img: `${changeCardSuit(card.card_id!, suit)}.png`,
            suit,
          };
        }
        return card;
      });
      return { hand: newHand };
    });
  },

  changeCardsNeon: (cardIndexes: number[]) => {
    set((state) => {
      const newHand = state.hand.map((card) => {
        if (cardIndexes.includes(card.idx)) {
          return {
            ...card,
            card_id: changeCardNeon(card.card_id!),
            img: `${changeCardNeon(card.card_id!)}.png`,
            isNeon: true,
          };
        }
        return card;
      });
      return { hand: newHand };
    });
  },

  changeCardsRank: (cardChanges: CardPlayEventValue[]) => {
    set((state) => {
      const cardIdByIndex = new Map(
        cardChanges.map((cardChange) => [cardChange.idx, cardChange.quantity])
      );

      const newHand = state.hand.map((card) => {
        const nextCardId = cardIdByIndex.get(card.idx);
        if (nextCardId === undefined) {
          return card;
        }

        const normalizedCardData = CARDS_SUIT_DATA[nextCardId % 200];

        return {
          ...card,
          card_id: nextCardId,
          img: `${nextCardId}.png`,
          suit: normalizedCardData?.suit ?? card.suit,
          value: normalizedCardData?.card ?? card.value,
          isNeon: nextCardId >= 200 && nextCardId < 300,
        };
      });

      return { hand: newHand };
    });
  },

  addModifier: (cardIdx: number, modifierIdx: number) => {
    const { preSelectedModifiers } = get();
    const modifiers = preSelectedModifiers[cardIdx] ?? [];

    if (modifiers.length < 1) {
      const newModifiers = [...modifiers, modifierIdx];
      set((state) => {
        return {
          preSelectedModifiers: {
            ...state.preSelectedModifiers,
            [cardIdx]: newModifiers,
          },
        };
      });
    }
  },

  setPlayIsNeon: (isNeon: boolean) => {
    set({ playIsNeon: isNeon });
  },

  setCardTransformationLock: (locked: boolean) => {
    set({ cardTransformationLock: locked });
  },
}));
