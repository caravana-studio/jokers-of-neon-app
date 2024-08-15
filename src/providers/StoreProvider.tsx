import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { Card } from "../types/Card";
import { PokerHandItem } from "../types/PokerHandItem";
import { getCardType } from "../utils/getCardType";
import { getCardUniqueId } from "../utils/getCardUniqueId";
import { useGameContext } from "./GameProvider";

interface IStoreContext {
  buyCard: (card: Card) => Promise<boolean>;
  levelUpPlay: (item: PokerHandItem) => Promise<boolean>;
  reroll: () => Promise<boolean>;
  locked: boolean;
  isPurchased: (card: Card | PokerHandItem) => boolean;
}

const StoreContext = createContext<IStoreContext>({
  buyCard: (_) => {
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
});
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { gameId } = useGameContext();
  const [locked, setLocked] = useState(false);
  const [purchasedCards, setPurchasedCards] = useState<string[]>([]);
  const [purchasedPokerHands, setPurchasedPokerHands] = useState<string[]>([]);

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
    setup: {
      systemCalls: {
        buyCard: dojoBuyCard,
        levelUpPokerHand: dojoLevelUpHand,
        storeReroll,
      },
    },
    account,
  } = useDojo();

  const buyCard = (card: Card): Promise<boolean> => {
    setLocked(true);
    addPurchasedCard(card);
    const promise = dojoBuyCard(
      account,
      gameId,
      card.idx,
      getCardType(card)
    );
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

  const reroll = () => {
    setLocked(true);
    const promise = storeReroll(account, gameId);
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
    const promise = dojoLevelUpHand(account, gameId, item.idx);
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
