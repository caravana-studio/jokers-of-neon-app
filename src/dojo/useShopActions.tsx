import { CairoCustomEnum } from "starknet";
import { achievementSfx } from "../constants/sfx";
import { DojoEvents } from "../enums/dojoEvents";
import { useAudio } from "../hooks/useAudio";
import { useGameContext } from "../providers/GameProvider";
import { useSettings } from "../providers/SettingsProvider";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { PowerUp } from "../types/Powerup/PowerUp";
import { getCardsFromEvents } from "../utils/getCardsFromEvents";
import { getEventKey } from "../utils/getEventKey";
import { getNumberValueFromEvent } from "../utils/getNumberValueFromEvent";
import { getPowerUpsFromEvents } from "../utils/getPowerUpsFromEvents";
import { handleAchievements } from "../utils/handleAchievements";
import {
  failedTransactionToast,
  showTransactionToast,
  updateTransactionToast,
} from "../utils/transactionNotifications";
import { useDojo } from "./useDojo";
import { useGameStore } from "../state/useGameStore";
import { useAnimationStore } from "../state/useAnimationStore";

const DESTROYED_SPECIAL_CARD_EVENT_KEY = getEventKey(
  DojoEvents.DESTROYED_SPECIAL_CARD
);

export const useShopActions = () => {
  const {
    setup: { client },
    account: { account },
  } = useDojo();

  const { replaceCards: setHand } = useCurrentHandStore();

  const { setDestroyedSpecialCardId } =
    useAnimationStore();

  const { maxPowerUpSlots, setPowerUps } = useGameStore();

  const { sfxVolume } = useSettings();
  const { play: achievementSound } = useAudio(achievementSfx, sfxVolume);

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
        await handleAchievements(tx.events, achievementSound);
        const event = tx.events.find(
          (event) => event.keys[1] === DESTROYED_SPECIAL_CARD_EVENT_KEY
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
          powerUps: [],
        };
      }
    } catch (e) {
      failedTransactionToast();
      console.log(e);
      return {
        success: false,
        cards: [],
        powerUps: [],
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
      const response = await client.shop_system.buyCard(
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

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
    }
  };

  const advanceNode = async (gameId: number, nodeId: number) => {
    try {
      showTransactionToast();
      const response = await client.map_system.advanceNode(
        account,
        gameId,
        nodeId
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
        const event = tx.events.find(
          (event) => event.keys[1] === DESTROYED_SPECIAL_CARD_EVENT_KEY
        );
        const cards = getCardsFromEvents(tx.events);
        const destroyedSpecialCard = event && getNumberValueFromEvent(event, 3);
        const responsePowerUps = getPowerUpsFromEvents(tx.events);
        setHand(cards);
        setPowerUps(responsePowerUps);

        destroyedSpecialCard && setDestroyedSpecialCardId(destroyedSpecialCard);
      }

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const buyPowerUp = async (gameId: number, power_up_idx: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buyPowerUp(
        account,
        gameId,
        power_up_idx
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const burnCard = async (gameId: number, card_id: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.burnCard(
        account,
        gameId,
        card_id
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
    }
  };

  const buySpecialCard = async (
    gameId: number,
    card_idx: number,
    isTemporary: boolean
  ) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buySpecialCard(
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

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
    }
  };

  const buySpecialSlot = async (gameId: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buySpecialSlot(account, gameId);
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
    }
  };

  const buyPack = async (gameId: number, pack_id: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buyLootBox(
        account,
        gameId,
        pack_id
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
    }
  };

  const selectCardsFromPack = async (gameId: number, cardIndexes: number[]) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.selectCardsFromLootBox(
        account,
        gameId,
        cardIndexes
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
    }
  };

  const levelUpPokerHand = async (gameId: number, item_id: number) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.buyPokerHand(
        account,
        gameId,
        item_id
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
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

      if (tx.isSuccess()) {
        await handleAchievements(tx.events, achievementSound);
      }

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
    advanceNode,
  };
};
