import { PropsWithChildren, createContext, useContext, useState } from "react";

import { buyPackSfx, buySfx, levelUpSfx, rerollSfx } from "../constants/sfx.ts";
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
import { PowerUp } from "../types/PowerUp.ts";
import { getCardType } from "../utils/getCardType";
import { useGameContext } from "./GameProvider";

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
  } = useShopState();

  const { gameId, addPowerUp } = useGameContext();
  const [locked, setLocked] = useState(false);
  const [lockRedirection, setLockRedirection] = useState(false);
  const { play: levelUpHandSound } = useAudio(levelUpSfx);
  const { play: buySound } = useAudio(buySfx);
  const { play: buyPackSound } = useAudio(buyPackSfx);
  const { play: rerollSound } = useAudio(rerollSfx, 0.5);

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
    const promise = dojoBuyCard(gameId, card.idx, getCardType(card));
    promise
      .then((response) => {
        if (!response) {
          stateRollbackBuyCard(card);
        }
      })
      .catch(() => {
        stateRollbackBuyCard(card);
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
    const promise = dojoBurnCard(gameId, card.card_id ?? 0);
    promise
      .then(() => {
        fetchShopItems();
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
    buySound();
    setLocked(true);
    stateBuyCard(card);
    const promise = dojoBuySpecialCard(gameId, card.idx, isTemporal);
    promise
      .then((response) => {
        if (!response) {
          stateRollbackBuyCard(card);
        }
      })
      .catch(() => {
        stateRollbackBuyCard(card);
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const buyPack = (pack: BlisterPackItem): Promise<boolean> => {
    buyPackSound();
    const promise = dojoBuyPack(gameId, Number(pack.idx));
    buyBlisterPack(Number(pack.idx));
    promise.catch(() => {
      rollbackBuyBlisterPack(Number(pack.idx));
    });
    return promise;
  };

  const selectCardsFromPack = (cardIndices: number[]): Promise<boolean> => {
    return dojoSelectCardsFromPack(gameId, cardIndices);
  };

  const reroll = () => {
    rerollSound();
    setLocked(true);
    const promise = storeReroll(gameId);
    promise
      .then(() => {
        fetchShopItems();
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
    const promise = dojoLevelUpHand(gameId, item.idx);
    promise
      .then((response) => {
        if (!response) {
          rollbackBuyPokerHand(item.idx);
        }
      })
      .catch(() => {
        rollbackBuyPokerHand(item.idx);
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const buySpecialSlot = () => {
    setLocked(true);
    buySlotSpecialCard();
    const promise = dojoBuySpecialSlot(gameId);
    promise
      .catch(() => {
        rollbackBuySlotSpecialCard();
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
