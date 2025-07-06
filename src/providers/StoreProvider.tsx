import { PropsWithChildren, createContext, useContext, useState } from "react";

import { buySfx, levelUpSfx, rerollSfx } from "../constants/sfx.ts";
import {
  EMPTY_BURN_ITEM,
  EMPTY_SPECIAL_SLOT_ITEM,
} from "../dojo/queries/getShopItems.ts";
import { BlisterPackItem } from "../dojo/typescript/models.gen";
import { useShopActions } from "../dojo/useShopActions";
import { useAudio } from "../hooks/useAudio.tsx";
import {
  RerollInformation,
  ShopItems,
  useShopState,
} from "../state/useShopState.ts";
import { Card } from "../types/Card";
import { PokerHandItem } from "../types/PokerHandItem";
import { PowerUp } from "../types/Powerup/PowerUp.ts";
import { getCardType } from "../utils/getCardType";
import { useGameContext } from "./GameProvider";
import { useGameStore } from "../state/useGameStore.ts";

interface IStoreContext extends ShopItems {
  buyCard: (card: Card) => Promise<boolean>;
  buySpecialCardItem: (card: Card, isTemporal: boolean) => Promise<boolean>;
  buyPack: (pack: BlisterPackItem) => Promise<boolean>;
  levelUpPlay: (item: PokerHandItem) => Promise<boolean>;
  reroll: () => Promise<boolean>;
  locked: boolean;
  selectCardsFromPack: (cardIndices: number[]) => Promise<boolean>;
  lockRedirection: boolean;
  setLockRedirection: (lock: boolean) => void;
  buySpecialSlot: () => Promise<boolean>;
  rerollInformation: RerollInformation;
  cash: number;
  run: boolean;
  setRun: (run: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  burnCard: (card: Card) => Promise<boolean>;
  buyPowerUp: (powerUp: PowerUp) => Promise<boolean>;
  rerolling: boolean;
  shopId: number;
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
  locked: false,
  lockRedirection: false,
  setLockRedirection: (_) => {},
  buySpecialSlot: () => new Promise((resolve) => resolve(false)),
  specialCards: [],
  modifierCards: [],
  commonCards: [],
  pokerHandItems: [],
  packs: [],
  powerUps: [],
  specialSlotItem: EMPTY_SPECIAL_SLOT_ITEM,
  burnItem: EMPTY_BURN_ITEM,
  rerollInformation: {
    rerollCost: 100,
    rerollExecuted: true,
  },
  cash: 0,
  run: false,
  setRun: (_) => {},
  loading: true,
  setLoading: (_) => {},
  burnCard: (_) => {
    return new Promise((resolve) => resolve(false));
  },
  buyPowerUp: (_) => {
    return new Promise((resolve) => resolve(false));
  },
  rerolling: false,
  shopId: 0,
});
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const {
    shopItems,
    fetchShopItems,
    rerollInformation,
    cash,
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
    run,
    setRun,
    loading,
    setLoading,
    rerolling,
    setRerolling,
    shopId,
  } = useShopState();

  const { id: gameId, addPowerUp } = useGameStore();
  const [locked, setLocked] = useState(false);
  const [lockRedirection, setLockRedirection] = useState(false);
  const { play: levelUpHandSound } = useAudio(levelUpSfx, 0.45);
  const { play: buySound } = useAudio(buySfx, 0.5);
  const { play: rerollSound } = useAudio(rerollSfx, 0.25);

  const {
    buyCard: dojoBuyCard,
    buySpecialCard: dojoBuySpecialCard,
    buyPack: dojoBuyPack,
    selectCardsFromPack: dojoSelectCardsFromPack,
    storeReroll,
    levelUpPokerHand: dojoLevelUpHand,
    buySpecialSlot: dojoBuySpecialSlot,
    burnCard: dojoBurnCard,
    buyPowerUp: dojoBuyPowerUp,
  } = useShopActions();

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
    buySound();
    setLocked(true);
    stateBuyCard(card);

    const promise = dojoBuyCard(gameId, card.idx, getCardType(card))
      .then(async ({ success }) => {
        if (!success) {
          stateRollbackBuyCard(card);
        }

        fetchShopItems();
        return success;
      })
      .catch(() => {
        stateRollbackBuyCard(card);
        return false;
      })
      .finally(() => {
        setLocked(false);
      });

    return promise;
  };

  const buyPowerUp = (powerUp: PowerUp): Promise<boolean> => {
    buySound();
    setLocked(true);
    stateBuyPowerUp(powerUp.idx);
    const promise = dojoBuyPowerUp(gameId, powerUp.idx);
    promise
      .then((response) => {
        if (response) {
          addPowerUp(powerUp);
          fetchShopItems();
        } else {
          rollbackBuyPowerUp(powerUp.idx);
        }
      })
      .catch(() => {
        rollbackBuyPowerUp(powerUp.idx);
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const burnCard = (card: Card): Promise<boolean> => {
    buySound();
    setLocked(true);

    const promise = dojoBurnCard(gameId, card.card_id ?? 0)
      .then(async ({ success }) => {
        fetchShopItems();
        return success;
      })
      .catch(() => false)
      .finally(() => {
        setLocked(false);
      });

    return promise;
  };

  const buySpecialCardItem = (
    card: Card,
    isTemporal: boolean
  ): Promise<boolean> => {
    buySound();
    setLocked(true);
    stateBuyCard(card);

    const promise = dojoBuySpecialCard(gameId, card.idx, isTemporal)
      .then(async ({ success }) => {
        if (!success) {
          stateRollbackBuyCard(card);
        }
        fetchShopItems();
        return success;
      })
      .catch(() => {
        stateRollbackBuyCard(card);
        return false;
      })
      .finally(() => {
        setLocked(false);
      });

    return promise;
  };

  const buyPack = (pack: BlisterPackItem): Promise<boolean> => {
    buyBlisterPack(Number(pack.idx));
    const promise = dojoBuyPack(gameId, Number(pack.idx))
      .then(async ({ success }) => {
        if (!success) {
          rollbackBuyBlisterPack(Number(pack.idx));
        }
        fetchShopItems();

        return success;
      })
      .catch(() => {
        rollbackBuyBlisterPack(Number(pack.idx));
        return false;
      });
    return promise;
  };

  const selectCardsFromPack = (cardIndices: number[]): Promise<boolean> => {
    const promise = dojoSelectCardsFromPack(gameId, cardIndices)
      .then(async ({ success }) => {
        return success;
      })
      .catch(() => {
        return false;
      });
    return promise;
  };

  const reroll = () => {
    setRerolling(true);
    rerollSound();
    setLocked(true);
    const promise = storeReroll(gameId);
    promise
      .then(() => {
        fetchShopItems().finally(() => {
          setTimeout(() => {
            setRerolling(false);
          }, 200);
        });
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const levelUpPlay = (item: PokerHandItem): Promise<boolean> => {
    levelUpHandSound();
    setLocked(true);
    buyPokerHand(item.idx);
    const promise = dojoLevelUpHand(gameId, item.idx)
      .then(async ({ success }) => {
        if (!success) {
          rollbackBuyPokerHand(item.idx);
        }

        return success;
      })
      .catch(() => {
        rollbackBuyPokerHand(item.idx);
        return false;
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const buySpecialSlot = (): Promise<boolean> => {
    setLocked(true);
    buySlotSpecialCard();

    const promise = dojoBuySpecialSlot(gameId)
      .then(async ({ success }) => {
        fetchShopItems();
        return success;
      })
      .catch(() => {
        rollbackBuySlotSpecialCard();
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
        locked,
        buyPack,
        selectCardsFromPack,
        lockRedirection,
        setLockRedirection,
        buySpecialSlot,
        specialCards: shopItems.specialCards,
        modifierCards: shopItems.modifierCards,
        commonCards: shopItems.commonCards,
        pokerHandItems: shopItems.pokerHandItems,
        packs: shopItems.packs,
        specialSlotItem: shopItems.specialSlotItem,
        burnItem: shopItems.burnItem,
        powerUps: shopItems.powerUps,
        rerollInformation,
        cash,
        run,
        setRun,
        loading,
        setLoading,
        burnCard,
        buyPowerUp,
        rerolling,
        shopId,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
