import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDojo } from "../dojo/useDojo";
import { useCustomToast } from "../hooks/useCustomToast";
import { useGetGame } from "../queries/useGetGame";
import { ShopItems, useGetShopItems } from "../queries/useGetShopItems";
import { useGameContext } from "./GameProvider";
import { useGetStore } from "../queries/useGetStore";

interface IStoreContext {
  cash: number;
  buyCard: (
    card_idx: number,
    card_type: number,
    price: number
  ) => Promise<boolean>;
  levelUpPlay: (item_id: number, price: number) => Promise<boolean>;
  shopItems: ShopItems;
  reroll: () => Promise<boolean>;
}

const StoreContext = createContext<IStoreContext>({
  cash: 0,
  buyCard: (_, __, ___) => {
    return new Promise((resolve) => resolve(false));
  },
  levelUpPlay: (_, __) => {
    return new Promise((resolve) => resolve(false));
  },  reroll: () => {
    return new Promise((resolve) => resolve(false));
  },
  shopItems: {
    specialCards: [],
    modifierCards: [],
    commonCards: [],
    pokerHandItems: [],
  },
});
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { gameId } = useGameContext();

  const { data: game } = useGetGame(gameId);
  const round = game?.round ?? 0;

  const { data: shopItems } = useGetShopItems(gameId, round);

  const { data: store } = useGetStore(gameId);

  const rerollCost = store?.reroll_cost ?? 0;

  const {
    setup: {
      systemCalls: { buyCard: dojoBuyCard, levelUpPokerHand: dojoLevelUpHand, storeReroll },
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
    const promise = dojoBuyCard(account.account, gameId, card_idx, card_type);
    promise.then((response) => {
      if (response) {
        setCash((prev) => prev - price);
      } else {
        showErrorToast("Error buying card");
      }
    });
    return promise;
  };

  const reroll = () => {
    const promise = storeReroll(account.account, gameId)
    promise.then((response) => {
      if (response) {
        setCash((prev) => prev - rerollCost);
      } else {
        showErrorToast("Error rerolling");
      }
    });
    return promise
  }

  const levelUpPlay = (item_id: number, price: number): Promise<boolean> => {
    const promise = dojoLevelUpHand(account.account, gameId, item_id);
    promise.then((response) => {
      if (response) {
        setCash((prev) => prev - price);
      } else {
        showErrorToast("Error leveling hand");
      }
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
        shopItems,
        reroll
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
