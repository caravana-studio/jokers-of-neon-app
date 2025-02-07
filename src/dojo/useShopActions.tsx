import { CairoCustomEnum } from "starknet";
import { DESTROYED_SPECIAL_CARD_EVENT } from "../constants/dojoEventKeys";
import { getCardsFromEvents } from "../utils/getCardsFromEvents";
import { getNumberValueFromEvent } from "../utils/getNumberValueFromEvent";
import { getPowerUpsFromEvents } from "../utils/getPowerUpsFromEvents";
import {
  failedTransactionToast,
  showTransactionToast,
  updateTransactionToast,
} from "../utils/transactionNotifications";
import { EventTypeTypeEnum } from "./typescript/models.gen";
import { useDojo } from "./useDojo";

export const useShopActions = () => {
  const {
    setup: { client },
    account: { account },
  } = useDojo();

  const skipShop = async (gameId: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.skipShop(account, gameId);
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        const event = tx.events.find(
          (event) => event.keys[1] === DESTROYED_SPECIAL_CARD_EVENT
        );
        return {
          success: true,
          cards: getCardsFromEvents(tx.events),
          destroyedSpecialCard: event && getNumberValueFromEvent(event, 3),
          powerUps: getPowerUpsFromEvents(tx.events),
        };
      } else {
        return {
          success: false,
          cards: [],
          powerUps: []
        };
      }
    } catch (e) {
      failedTransactionToast();
      console.log(e);
      return {
        success: false,
        cards: [],
        powerUps: []
      };
    }
  };

  const buyCard = async (
    gameId: number,
    card_idx: number,
    card_type: CairoCustomEnum
  ) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buyCardItem(
        account,
        gameId,
        card_idx,
        card_type
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const buyPowerUp = async (
    gameId: number,
    power_up_idx: number,
  ) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buyPowerUpItem(
        account,
        gameId,
        power_up_idx,
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const burnCard = async (gameId: number, card_id: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buyBurnItem(
        account,
        gameId,
        card_id
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const buySpecialCard = async (
    gameId: number,
    card_idx: number,
    isTemporary: boolean
  ) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buySpecialCardItem(
        account,
        gameId,
        card_idx,
        isTemporary
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const buySpecialSlot = async (gameId: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buySlotSpecialCardItem(
        account,
        gameId
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const buyPack = async (gameId: number, pack_id: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buyBlisterPackItem(
        account,
        gameId,
        pack_id
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const selectCardsFromPack = async (gameId: number, cardIndexes: number[]) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.selectCardsFromBlister(
        account,
        gameId,
        cardIndexes
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const levelUpPokerHand = async (gameId: number, item_id: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buyPokerHandItem(
        account,
        gameId,
        item_id
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const storeReroll = async (gameId: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.reroll(account, gameId);
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);
      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  return {
    skipShop,
    buyCard,
    burnCard,
    buySpecialCard,
    buyPack,
    selectCardsFromPack,
    levelUpPokerHand,
    storeReroll,
    buySpecialSlot,
    buyPowerUp,
  };
};
