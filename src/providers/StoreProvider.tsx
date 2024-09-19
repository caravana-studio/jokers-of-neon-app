import { PropsWithChildren, createContext, useContext, useState } from "react";

import { BlisterPackItem } from "../dojo/typescript/models.gen";
import { useDojo } from "../dojo/useDojo";
import { useShopActions } from "../dojo/useShopActions";
import { Card } from "../types/Card";
import { PokerHandItem } from "../types/PokerHandItem";
import { getCardType } from "../utils/getCardType";
import { getCardUniqueId } from "../utils/getCardUniqueId";
import { useGameContext } from "./GameProvider";
import { useAudio } from "../hooks/useAudio.tsx";

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
  const {play:levelUpHandSound} = useAudio('/music/Level_Up_1.wav');
  const {play:buySound} = useAudio('/music/Buy_From_Store_1.wav');
  const {play:buyPackSound} = useAudio('/music/Opening_Packs_Boxes_1.wav');
  const {play:rerollSound} = useAudio('/music/Reroll_Items_1.wav');

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
    account: { account },
  } = useDojo();

  const {
    buyCard: dojoBuyCard,
    buyPack: dojoBuyPack,
    selectCardsFromPack: dojoSelectCardsFromPack,
    storeReroll,
    levelUpPokerHand: dojoLevelUpHand,
  } = useShopActions();

  const buyCard = (card: Card): Promise<boolean> => {
    buySound();
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
    buyPackSound();
    return dojoBuyPack(gameId, Number(pack.idx));
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
        clearPurchasedItems();
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const levelUpPlay = (item: PokerHandItem): Promise<boolean> => {
    levelUpHandSound();
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
