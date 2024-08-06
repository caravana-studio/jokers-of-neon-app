import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGame } from "../dojo/queries/useGame";
import { useShop } from "../dojo/queries/useShop";
import { useDojo } from "../dojo/useDojo";
import { useCustomToast } from "../hooks/useCustomToast";
import { useGameContext } from "./GameProvider";

interface IStoreContext {
  cash: number;
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
  cash: 0,
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

  const game = useGame();
  const store = useShop();

  const rerollCost = store?.reroll_cost ?? 0;
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
  const { showErrorToast } = useCustomToast();

  const [cash, setCash] = useState(game?.cash ?? 0);

  const buyCard = (
    card_idx: number,
    card_type: number,
    price: number
  ): Promise<boolean> => {
    setLocked(true);
    const promise = dojoBuyCard(account.account, gameId, card_idx, card_type);
    promise
      .then((response) => {
        if (response) {
          setCash((prev) => prev - price);
        } else {
          showErrorToast("Error buying card");
        }
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const reroll = () => {
    setLocked(true);
    const promise = storeReroll(account.account, gameId);
    promise
      .then((response) => {
        if (response) {
          setCash((prev) => prev - rerollCost);
        } else {
          showErrorToast("Error rerolling");
        }
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  const levelUpPlay = (item_id: number, price: number): Promise<boolean> => {
    setLocked(true);
    const promise = dojoLevelUpHand(account.account, gameId, item_id);
    promise
      .then((response) => {
        if (response) {
          setCash((prev) => prev - price);
        } else {
          showErrorToast("Error leveling hand");
        }
      })
      .finally(() => {
        setLocked(false);
      });
    return promise;
  };

  useEffect(() => {
    if (game && game.cash > 1) {
      setCash(game.cash);
    }
  }, [game?.cash]);

  return (
    <StoreContext.Provider
      value={{
        cash,
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
