import { PropsWithChildren, createContext, useContext } from "react";

import { isMockGameApiMode } from "../config/gameMode";
import { buySfx, levelUpSfx, rerollSfx } from "../constants/sfx.ts";
import { BlisterPackItem } from "../dojo/typescript/models.gen";
import { useDojo } from "../dojo/useDojo.tsx";
import { useShopActions } from "../dojo/useShopActions";
import { useAudio } from "../hooks/useAudio.tsx";
import { useDeckStore } from "../state/useDeckStore.ts";
import { useRoguelikeRuntimeStore } from "../state/roguelike/useRoguelikeRuntimeStore";
import {
  buildMockDynamicShopState,
  buildMockDynamicShopStateForReroll,
} from "../state/roguelike/mockDynamicStore";
import { useProgressStore } from "../state/roguelike/useProgressStore";
import { useRunStore } from "../state/roguelike/useRunStore";
import { useGameStore } from "../state/useGameStore.ts";
import { useShopStore } from "../state/useShopStore.ts";
import { Card } from "../types/Card";
import { PokerHandItem } from "../types/PokerHandItem";
import { PowerUp } from "../types/Powerup/PowerUp.ts";
import { getCardType } from "../utils/getCardType.ts";
import { useCardData } from "./CardDataProvider.tsx";
import { useSettings } from "./SettingsProvider";

interface IStoreContext {
  buyCard: (card: Card) => Promise<boolean>;
  buySpecialCardItem: (card: Card, isTemporal: boolean) => Promise<boolean>;
  buyPack: (pack: BlisterPackItem) => Promise<boolean>;
  levelUpPlay: (item: PokerHandItem) => Promise<boolean>;
  reroll: () => Promise<boolean>;
  selectCardsFromPack: (cardIndices: number[]) => Promise<boolean>;
  buySpecialSlot: () => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  burnCards: (cards: Card[], totalCost: number) => Promise<boolean>;
  buyPowerUp: (powerUp: PowerUp) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const StoreContext = createContext<IStoreContext>({
  buyCard: (_) => {
    return new Promise((resolve) => resolve(false));
  },
  buySpecialCardItem: (_) => {
    return new Promise((resolve) => resolve(false));
  },
  buyPack: (_) => {
    return new Promise((resolve) => resolve(false));
  },
  selectCardsFromPack: (_) => {
    return new Promise((resolve) => resolve(false));
  },
  levelUpPlay: (_) => {
    return new Promise((resolve) => resolve(false));
  },
  reroll: () => {
    return new Promise((resolve) => resolve(false));
  },
  buySpecialSlot: () => new Promise((resolve) => resolve(false)),
  setLoading: (_) => {},
  burnCards: (_cards, _totalCost) => {
    return new Promise((resolve) => resolve(false));
  },
  buyPowerUp: (_) => {
    return new Promise((resolve) => resolve(false));
  },
  refetch: () => new Promise((resolve) => resolve())
});
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const {
    refetchShopStore,
    buySpecialCard,
    buyModifierCard,
    buyCommonCard,
    buyPokerHand,
    buyBlisterPack,
    buySlotSpecialCard,
    buyPowerUp: stateBuyPowerUp,
    rollbackBuySpecialCard,
    rollbackBuyModifierCard,
    rollbackBuyCommonCard,
    rollbackBuyPokerHand,
    rollbackBuyBlisterPack,
    rollbackBuySlotSpecialCard,
    rollbackBuyPowerUp,
    setLoading,
    setRerolling,
    setLocked,
    specialSlotItem,
    burnItem,
  } = useShopStore();

  const {
    setup: { client },
  } = useDojo();

  const {
    id: gameId,
    addPowerUp,
    reroll: stateReroll,
    rollbackReroll,
    addCash,
    removeCash,
    refetchSpecialCards,
    refetchPlays,
    refetchPowerUps,
    addSpecialSlot,
    removeSpecialSlot,
  } = useGameStore();

  const { fetchDeck } = useDeckStore();

  const { getCardData } = useCardData();

  const { sfxVolume } = useSettings();
  const { play: levelUpHandSound } = useAudio(levelUpSfx, sfxVolume);
  const { play: buySound } = useAudio(buySfx, sfxVolume);
  const { play: rerollSound } = useAudio(rerollSfx, sfxVolume);

  const {
    buyCard: dojoBuyCard,
    buySpecialCard: dojoBuySpecialCard,
    buyPack: dojoBuyPack,
    selectCardsFromPack: dojoSelectCardsFromPack,
    storeReroll,
    levelUpPokerHand: dojoLevelUpHand,
    buySpecialSlot: dojoBuySpecialSlot,
    burnCards: dojoBurnCards,
    buyPowerUp: dojoBuyPowerUp,
  } = useShopActions();

  const fetchShopItems = async () => {
    if (isMockGameApiMode) {
      const activeRun = useRunStore.getState().activeRun;
      const currentGameState = useGameStore.getState();
      const unlockedSystems =
        useProgressStore.getState().profile?.unlockedSystems ?? [];
      const runId = activeRun?.runId ?? `mock-run-${currentGameState.id || 0}`;
      const runNumber = activeRun?.runNumber ?? 1;
      const safeShopId = currentGameState.shopId > 0 ? currentGameState.shopId : 1;

      const mockState = buildMockDynamicShopState({
        gameId: currentGameState.id || runNumber,
        runId,
        shopId: safeShopId,
        unlockedSystems,
      });

      useShopStore.setState({
        ...mockState,
        loadedItems: true,
        loading: false,
        rerolling: false,
        locked: false,
      });
      return;
    }

    await refetchShopStore(client, gameId);
  };

  const setMockCash = (nextCash: number) => {
    const safeCash = Math.max(0, nextCash);
    useGameStore.getState().setCash(safeCash);
    void useRunStore.getState().syncRunGold(safeCash);

    useRoguelikeRuntimeStore.getState().updateCash(safeCash);
  };

  const trySpendMockCash = (cost: number): boolean => {
    const safeCost = Math.max(0, cost);
    const currentCash = useGameStore.getState().cash;
    if (currentCash < safeCost) {
      return false;
    }

    setMockCash(currentCash - safeCost);
    return true;
  };

  const stateBuyCard = (card: Card) => {
    if (card.isSpecial) {
      buySpecialCard(card.idx);
    } else if (card.isModifier) {
      buyModifierCard(card.idx);
    } else {
      buyCommonCard(card.idx);
    }
  };

  const stateRollbackBuyCard = (card: Card) => {
    if (card.isSpecial) {
      rollbackBuySpecialCard(card.idx);
    } else if (card.isModifier) {
      rollbackBuyModifierCard(card.idx);
    } else {
      rollbackBuyCommonCard(card.idx);
    }
  };

  const buyCard = (card: Card): Promise<boolean> => {
    if (isMockGameApiMode) {
      buySound();
      setLocked(true);
      stateBuyCard(card);

      const cost = card?.discount_cost ? card.discount_cost : card?.price ?? 0;
      const gameState = useGameStore.getState();

      if (card.isSpecial && gameState.specialCards.length >= gameState.specialSlots) {
        stateRollbackBuyCard(card);
        setLocked(false);
        return Promise.resolve(false);
      }

      if (!trySpendMockCash(cost)) {
        stateRollbackBuyCard(card);
        setLocked(false);
        return Promise.resolve(false);
      }

      if (card.isSpecial) {
        useGameStore.setState((state) => {
          if (state.specialCards.some((entry) => entry.idx === card.idx)) {
            return {};
          }

          return {
            specialCards: [...state.specialCards, { ...card }],
          };
        });
      }

      setLocked(false);
      return Promise.resolve(true);
    }

    buySound();
    setLocked(true);
    stateBuyCard(card);
    const cost = card?.discount_cost ? card.discount_cost : card?.price ?? 0;
    removeCash(cost);

    const promise = dojoBuyCard(gameId, card.idx, getCardType(card))
      .then(async ({ success }) => {
        if (!success) {
          stateRollbackBuyCard(card);
          addCash(cost);
        }
        fetchDeck(client, gameId, getCardData);
        return success;
      })
      .catch(() => {
        stateRollbackBuyCard(card);
        addCash(cost);
        return false;
      })
      .finally(() => {
        setLocked(false);
      });

    return promise;
  };

  const buyPowerUp = (powerUp: PowerUp): Promise<boolean> => {
    if (isMockGameApiMode) {
      buySound();
      setLocked(true);
      stateBuyPowerUp(powerUp.idx);

      const cost = powerUp?.discount_cost
        ? powerUp.discount_cost
        : powerUp?.cost ?? 0;
      const gameState = useGameStore.getState();
      const occupiedSlots = gameState.powerUps.filter((item) => item !== null).length;
      const noSlotsAvailable = occupiedSlots >= gameState.maxPowerUpSlots;

      if (noSlotsAvailable || !trySpendMockCash(cost)) {
        rollbackBuyPowerUp(powerUp.idx);
        setLocked(false);
        return Promise.resolve(false);
      }

      addPowerUp({
        ...powerUp,
        purchased: true,
      });

      setLocked(false);
      return Promise.resolve(true);
    }

    buySound();
    setLocked(true);
    stateBuyPowerUp(powerUp.idx);
    const cost = powerUp?.discount_cost
      ? powerUp.discount_cost
      : powerUp?.cost ?? 0;
    removeCash(cost);

    const promise = dojoBuyPowerUp(gameId, powerUp.idx);
    promise
      .then((response) => {
        if (response) {
          refetchPowerUps(client, gameId);
        } else {
          rollbackBuyPowerUp(powerUp.idx);
          addCash(cost);
        }
      })
      .catch(() => {
        rollbackBuyPowerUp(powerUp.idx);
        addCash(cost);
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const burnCards = (cards: Card[], totalCost: number): Promise<boolean> => {
    if (isMockGameApiMode) {
      buySound();
      setLocked(true);

      if (!trySpendMockCash(totalCost)) {
        setLocked(false);
        return Promise.resolve(false);
      }

      useShopStore.setState((state) => ({
        burnItem: state.burnItem
          ? { ...state.burnItem, purchased: true }
          : state.burnItem,
      }));

      setLocked(false);
      return Promise.resolve(true);
    }

    buySound();
    setLocked(true);

    removeCash(totalCost);

    const cardIds = cards.map((card) => card.card_id ?? 0);
    const promise = dojoBurnCards(gameId, cardIds)
      .then(async ({ success }) => {
        if (success) {
          fetchDeck(client, gameId, getCardData);
          refetchShopStore(client, gameId);
        } else {
          addCash(totalCost);
        }
        return success;
      })
      .catch(() => {
        addCash(totalCost);
        return false;
      })
      .finally(() => {
        setLocked(false);
      });

    return promise;
  };

  const buySpecialCardItem = (
    card: Card,
    isTemporal: boolean
  ): Promise<boolean> => {
    if (isMockGameApiMode) {
      buySound();
      setLocked(true);
      stateBuyCard(card);

      const regularCost = card?.discount_cost
        ? card.discount_cost
        : card?.price ?? 0;
      const temporalCost = card?.temporary_discount_cost
        ? card.temporary_discount_cost
        : card?.temporary_price ?? 0;
      const cost = isTemporal ? temporalCost : regularCost;
      const gameState = useGameStore.getState();

      if (gameState.specialCards.length >= gameState.specialSlots || !trySpendMockCash(cost)) {
        stateRollbackBuyCard(card);
        setLocked(false);
        return Promise.resolve(false);
      }

      useGameStore.setState((state) => {
        if (state.specialCards.some((entry) => entry.idx === card.idx)) {
          return {};
        }

        return {
          specialCards: [
            ...state.specialCards,
            {
              ...card,
              temporary: isTemporal,
            },
          ],
        };
      });

      setLocked(false);
      return Promise.resolve(true);
    }

    buySound();
    setLocked(true);
    stateBuyCard(card);

    const regularCost = card?.discount_cost
      ? card.discount_cost
      : card?.price ?? 0;
    const temporalCost = card?.temporary_discount_cost
      ? card.temporary_discount_cost
      : card?.temporary_price ?? 0;
    const cost = isTemporal ? temporalCost : regularCost;
    removeCash(cost);

    const promise = dojoBuySpecialCard(gameId, card.idx, isTemporal)
      .then(async ({ success }) => {
        if (!success) {
          stateRollbackBuyCard(card);
          addCash(cost);
        } else {
          refetchSpecialCards(client, gameId);
        }
        return success;
      })
      .catch(() => {
        stateRollbackBuyCard(card);
        addCash(cost);
        return false;
      })
      .finally(() => {
        setLocked(false);
      });

    return promise;
  };

  const buyPack = (pack: BlisterPackItem): Promise<boolean> => {
    if (isMockGameApiMode) {
      buySound();
      setLocked(true);

      const cost = pack?.discount_cost ? pack.discount_cost : pack?.cost ?? 0;
      if (!trySpendMockCash(cost)) {
        setLocked(false);
        return Promise.resolve(false);
      }

      buyBlisterPack(Number(pack.idx));
      setLocked(false);
      return Promise.resolve(true);
    }

    const cost = pack?.discount_cost ? pack.discount_cost : pack?.cost ?? 0;
    removeCash(cost);
    buyBlisterPack(Number(pack.idx));
    const promise = dojoBuyPack(gameId, Number(pack.idx))
      .then(async ({ success }) => {
        if (!success) {
          addCash(cost);
          rollbackBuyBlisterPack(Number(pack.idx));
        }
        return success;
      })
      .catch(() => {
        addCash(cost);
        rollbackBuyBlisterPack(Number(pack.idx));
        return false;
      });
    return promise;
  };

  const selectCardsFromPack = (cardIndices: number[]): Promise<boolean> => {
    if (isMockGameApiMode) {
      return Promise.resolve(cardIndices.length > 0);
    }

    const promise = dojoSelectCardsFromPack(gameId, cardIndices)
      .then(async ({ success }) => {
        refetchSpecialCards(client, gameId);
        fetchDeck(client, gameId, getCardData);
        return success;
      })
      .catch(() => {
        return false;
      });
    return promise;
  };

  const reroll = () => {
    if (isMockGameApiMode) {
      setRerolling(true);
      rerollSound();
      setLocked(true);
      stateReroll();

      const activeRun = useRunStore.getState().activeRun;
      const gameState = useGameStore.getState();
      const unlockedSystems =
        useProgressStore.getState().profile?.unlockedSystems ?? [];
      const runId = activeRun?.runId ?? `mock-run-${gameState.id || 0}`;
      const runNumber = activeRun?.runNumber ?? 1;
      const safeShopId = gameState.shopId > 0 ? gameState.shopId : 1;

      const mockState = buildMockDynamicShopStateForReroll({
        gameId: gameState.id || runNumber,
        runId,
        shopId: safeShopId,
        unlockedSystems,
      });

      useShopStore.setState({
        ...mockState,
        loadedItems: true,
        loading: false,
        rerolling: true,
        locked: true,
      });

      const promise = Promise.resolve(true);
      promise
        .then(() => {
          setTimeout(() => {
            setRerolling(false);
            setLocked(false);
          }, 200);
        })
        .catch(() => {
          rollbackReroll();
          setRerolling(false);
          setLocked(false);
        });

      return promise;
    }

    setRerolling(true);
    rerollSound();
    setLocked(true);
    const promise = storeReroll(gameId);
    stateReroll();
    promise
      .then(() => {
        fetchShopItems().finally(() => {
          setTimeout(() => {
            setRerolling(false);
          }, 200);
        });
      })
      .catch(() => {
        rollbackReroll();
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const levelUpPlay = (item: PokerHandItem): Promise<boolean> => {
    if (isMockGameApiMode) {
      levelUpHandSound();
      setLocked(true);
      buyPokerHand(item.idx);

      const cost = item?.discount_cost ? item.discount_cost : item?.cost ?? 0;
      if (!trySpendMockCash(cost)) {
        rollbackBuyPokerHand(item.idx);
        setLocked(false);
        return Promise.resolve(false);
      }

      useGameStore.setState((state) => ({
        plays: state.plays.map((play) =>
          play.poker_hand.toString() === item.poker_hand
            ? {
                ...play,
                level: item.level,
                points: item.points,
                multi: item.multi,
              }
            : play
        ),
      }));

      setLocked(false);
      return Promise.resolve(true);
    }

    levelUpHandSound();
    setLocked(true);
    buyPokerHand(item.idx);
    const cost = item?.discount_cost ? item.discount_cost : item?.cost ?? 0;
    removeCash(cost);
    const promise = dojoLevelUpHand(gameId, item.idx)
      .then(async ({ success }) => {
        if (!success) {
          rollbackBuyPokerHand(item.idx);
          addCash(cost);
        } else {
          refetchPlays(client, gameId);
        }

        return success;
      })
      .catch(() => {
        rollbackBuyPokerHand(item.idx);
        addCash(cost);
        return false;
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const buySpecialSlot = (): Promise<boolean> => {
    if (isMockGameApiMode) {
      setLocked(true);
      buySlotSpecialCard();

      const gameState = useGameStore.getState();
      const cost = specialSlotItem?.discount_cost
        ? specialSlotItem.discount_cost
        : specialSlotItem?.cost ?? 0;

      if (gameState.specialSlots >= gameState.maxSpecialCards || !trySpendMockCash(cost)) {
        rollbackBuySlotSpecialCard();
        setLocked(false);
        return Promise.resolve(false);
      }

      addSpecialSlot();
      setLocked(false);
      return Promise.resolve(true);
    }

    setLocked(true);
    buySlotSpecialCard();
    const cost = specialSlotItem?.discount_cost
      ? specialSlotItem.discount_cost
      : specialSlotItem?.cost ?? 0;
    removeCash(cost);
    addSpecialSlot();
    const promise = dojoBuySpecialSlot(gameId)
      .then(async ({ success }) => {
        if (!success) {
          rollbackBuySlotSpecialCard();
          addCash(cost);
          removeSpecialSlot();
        }
        fetchShopItems();
        return success;
      })
      .catch(() => {
        rollbackBuySlotSpecialCard();
        removeSpecialSlot();
        addCash(cost);
        return false;
      })
      .finally(() => {
        setLocked(false);
      });

    return promise;
  };

  return (
    <StoreContext.Provider
      value={{
        buyCard,
        buySpecialCardItem,
        levelUpPlay,
        reroll,
        buyPack,
        selectCardsFromPack,
        buySpecialSlot,
        setLoading,
        burnCards,
        buyPowerUp,
        refetch: fetchShopItems
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
