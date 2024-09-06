import { PropsWithChildren, createContext, useContext, useState } from "react";

import { BlisterPackItem } from "../dojo/typescript/models.gen";
import { useDojo } from "../dojo/useDojo";
import { useShopActions } from "../dojo/useShopActions";
import { Card } from "../types/Card";
import { PokerHandItem } from "../types/PokerHandItem";
import { getCardType } from "../utils/getCardType";
import { getCardUniqueId } from "../utils/getCardUniqueId";
import { useGameContext } from "./GameProvider";

interface IStoreContext {
  buyCard: (card: Card) => Promise<boolean>;
  buyPack: (pack: BlisterPackItem) => Promise<boolean>;
  levelUpPlay: (item: PokerHandItem) => Promise<boolean>;
  reroll: () => Promise<boolean>;
  locked: boolean;
  isPurchased: (card: Card | PokerHandItem) => boolean;
  selectCardsFromPack: (cardIndices: number[]) => Promise<boolean>;
  lockRedirection: boolean;
  setLockRedirection: (lock: boolean) => void;
}

const StoreContext = createContext<IStoreContext>({
  buyCard: (_) => {
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
  isPurchased: (_) => false,
  lockRedirection: false,
  setLockRedirection: (_) => {},
});
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { gameId } = useGameContext();
  const [locked, setLocked] = useState(false);
  const [purchasedCards, setPurchasedCards] = useState<string[]>([]);
  const [purchasedPokerHands, setPurchasedPokerHands] = useState<string[]>([]);
  const [lockRedirection, setLockRedirection] = useState(false);

  const addPurchasedCard = (card: Card) => {
    setPurchasedCards((prev) => [...prev, getCardUniqueId(card)]);
  };
  const addPokerHandPurchased = (item: PokerHandItem) => {
    setPurchasedPokerHands((prev) => [...prev, item.poker_hand]);
  };
  const isPurchased = (item: Card | PokerHandItem) => {
    if (item.purchased) {
      return true;
    } else if ("poker_hand" in item) {
      return purchasedPokerHands.includes(item.poker_hand);
    } else {
      return purchasedCards.includes(getCardUniqueId(item));
    }
  };
  const clearPurchasedItems = () => {
    setPurchasedCards([]);
    setPurchasedPokerHands([]);
  };
  const rollbackPurchasedCard = (card: Card) => {
    setPurchasedCards((prev) =>
      prev.filter((id) => id !== getCardUniqueId(card))
    );
  };
  const rollbackPokerHandPurchased = (item: PokerHandItem) => {
    setPurchasedPokerHands((prev) =>
      prev.filter((id) => id !== item.poker_hand)
    );
  };

  const {
    buyCard: dojoBuyCard,
    buyPack: dojoBuyPack,
    selectCardsFromPack: dojoSelectCardsFromPack,
    storeReroll,
    levelUpPokerHand: dojoLevelUpHand,
  } = useShopActions();

  const buyCard = (card: Card): Promise<boolean> => {
    setLocked(true);
    addPurchasedCard(card);
    const promise = dojoBuyCard(gameId, card.idx, getCardType(card));
    promise
      .then((response) => {
        if (!response) {
          rollbackPurchasedCard(card);
        }
      })
      .catch(() => {
        rollbackPurchasedCard(card);
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const buyPack = (pack: BlisterPackItem): Promise<boolean> => {
    return dojoBuyPack(gameId, Number(pack.idx));
  };

  const selectCardsFromPack = (cardIndices: number[]): Promise<boolean> => {
    return dojoSelectCardsFromPack(gameId, cardIndices);
  };

  const reroll = () => {
    setLocked(true);
    const promise = storeReroll(gameId);
    promise
      .then(() => {
        clearPurchasedItems();
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const levelUpPlay = (item: PokerHandItem): Promise<boolean> => {
    setLocked(true);
    addPokerHandPurchased(item);
    const promise = dojoLevelUpHand(gameId, item.idx);
    promise
      .then((response) => {
        if (!response) {
          rollbackPokerHandPurchased(item);
        }
      })
      .catch(() => {
        rollbackPokerHandPurchased(item);
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
        levelUpPlay,
        reroll,
        locked,
        isPurchased,
        buyPack,
        selectCardsFromPack,
        lockRedirection,
        setLockRedirection,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
