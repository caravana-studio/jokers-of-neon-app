import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { useGameContext } from "./GameProvider";

interface IStoreContext {
  buyCard: (
    card_idx: number,
    card_type: number,
    price: number
  ) => Promise<boolean>;
  levelUpPlay: (item_id: number, price: number) => Promise<boolean>;
  reroll: () => Promise<boolean>;
  locked: boolean;
}

const StoreContext = createContext<IStoreContext>({
  buyCard: (_, __, ___) => {
    return new Promise((resolve) => resolve(false));
  },
  levelUpPlay: (_, __) => {
    return new Promise((resolve) => resolve(false));
  },
  reroll: () => {
    return new Promise((resolve) => resolve(false));
  },
  locked: false,
});
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { gameId } = useGameContext();
  const [locked, setLocked] = useState(false);

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

  const buyCard = (
    card_idx: number,
    card_type: number,
    price: number
  ): Promise<boolean> => {
    setLocked(true);
    const promise = dojoBuyCard(account.account, gameId, card_idx, card_type);
    promise.finally(() => {
      setLocked(false);
    });
    return promise;
  };

  const reroll = () => {
    setLocked(true);
    const promise = storeReroll(account.account, gameId);
    promise.finally(() => {
      setLocked(false);
    });
    return promise;
  };

  const levelUpPlay = (item_id: number, price: number): Promise<boolean> => {
    setLocked(true);
    const promise = dojoLevelUpHand(account.account, gameId, item_id);
    promise.finally(() => {
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
