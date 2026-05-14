import { CairoCustomEnum } from "starknet";
import { achievementSfx } from "../constants/sfx";
import { DojoEvents } from "../enums/dojoEvents";
import { useAudio } from "../hooks/useAudio";
import { useCardData } from "../providers/CardDataProvider";
import { AppType, useAppContext } from "../providers/AppContextProvider";
import { useSettings } from "../providers/SettingsProvider";
import { useAnimationStore } from "../state/useAnimationStore";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useDeckStore } from "../state/useDeckStore";
import { useGameStore } from "../state/useGameStore";
import { useShopStore } from "../state/useShopStore";
import { getCardsFromEvents } from "../utils/getCardsFromEvents";
import { getEventKey } from "../utils/getEventKey";
import { getNumberValueFromEvent } from "../utils/getNumberValueFromEvent";
import { getPowerUpsFromEvents } from "../utils/getPowerUpsFromEvents";
import { handleXPEvents } from "../utils/handleXPEvents";
import {
  failedTransactionToast,
  showTransactionToast,
  updateTransactionToast,
} from "../utils/transactionNotifications";
import { logTransactionError } from "../utils/logTransactionError";
import { useDojo } from "./useDojo";
import { useUsername } from "./utils/useUsername";

const DESTROYED_SPECIAL_CARD_EVENT_KEY = getEventKey(
  DojoEvents.DESTROYED_SPECIAL_CARD
);

export const useShopActions = () => {
  const appType = useAppContext();
  const shouldShowXpToasts = appType !== AppType.MINIAPP;
  const {
    setup: { client },
    account: { account },
    accountType,
  } = useDojo();
  const username = useUsername();

  const { replaceCards: setHand } = useCurrentHandStore();

  const { fetchDeck } = useDeckStore();
  const { getCardData } = useCardData();

  const { setDestroyedSpecialCardId } = useAnimationStore();

  const { setPowerUps } = useGameStore();

  const { reset } = useShopStore();

  const { sfxVolume } = useSettings();
  const { play: achievementSound } = useAudio(achievementSfx, sfxVolume);

  const logActionError = (
    action: string,
    error: unknown,
    context: Record<string, unknown> = {}
  ) => {
    logTransactionError(`Shop action failed: ${action}`, error, {
      accountAddress: account.address,
      accountType,
      ...context,
    });
  };

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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
        const event = tx.value.events.find(
          (event) => event.keys[1] === DESTROYED_SPECIAL_CARD_EVENT_KEY
        );
        reset();
        return {
          success: true,
          cards: getCardsFromEvents(tx.value.events),
          destroyedSpecialCard: event && getNumberValueFromEvent(event, 3),
          powerUps: getPowerUpsFromEvents(tx.value.events),
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
      logActionError("skipShop", e, { gameId });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return { success };
    } catch (e) {
      logActionError("buyCard", e, { gameId, card_idx, card_type });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
        const event = tx.value.events.find(
          (event) => event.keys[1] === DESTROYED_SPECIAL_CARD_EVENT_KEY
        );
        const cards = getCardsFromEvents(tx.value.events);
        const destroyedSpecialCard = event && getNumberValueFromEvent(event, 3);
        const responsePowerUps = getPowerUpsFromEvents(tx.value.events);

        setHand(cards);
        setPowerUps(responsePowerUps);
        fetchDeck(client, gameId, getCardData);

        destroyedSpecialCard && setDestroyedSpecialCardId(destroyedSpecialCard);
      }

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      logActionError("advanceNode", e, { gameId, nodeId });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      logActionError("buyPowerUp", e, { gameId, power_up_idx });
      return failedTransactionToast();
    }
  };

  const burnCards = async (gameId: number, card_ids: number[]) => {
    try {
      showTransactionToast();
      const response = await client.shop_system.burnCards(
        account,
        gameId,
        card_ids
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return { success };
    } catch (e) {
      logActionError("burnCards", e, { gameId, card_ids });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return { success };
    } catch (e) {
      logActionError("buySpecialCard", e, { gameId, card_idx, isTemporary });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return { success };
    } catch (e) {
      logActionError("buySpecialSlot", e, { gameId });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return { success };
    } catch (e) {
      logActionError("buyPack", e, { gameId, pack_id });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return { success };
    } catch (e) {
      logActionError("selectCardsFromPack", e, { gameId, cardIndexes });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return { success };
    } catch (e) {
      logActionError("levelUpPokerHand", e, { gameId, item_id });
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
        await handleXPEvents(tx.value.events, achievementSound, account.address, accountType, username, shouldShowXpToasts);
      }

      return updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      logActionError("storeReroll", e, { gameId });
      return failedTransactionToast();
    }
  };

  return {
    skipShop,
    buyCard,
    burnCards,
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
