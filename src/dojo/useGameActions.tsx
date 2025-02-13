import { shortString } from "starknet";
import {
  CREATE_GAME_EVENT,
  PLAY_GAME_OVER_EVENT,
} from "../constants/dojoEventKeys";
import { getLevelUpPlayEvent } from "../utils/discardEvents/getLevelUpPlayEvent";
import { getCardsFromEvents } from "../utils/getCardsFromEvents";
import { getNumberValueFromEvents } from "../utils/getNumberValueFromEvent";
import { getPlayEvents } from "../utils/playEvents/getPlayEvents";
import {
  failedTransactionToast,
  showTransactionToast,
  updateTransactionToast,
} from "../utils/transactionNotifications";
import { useDojo } from "./useDojo";
import { getModifiersForContract } from "./utils/getModifiersForContract";

const createGameEmptyResponse = {
  gameId: 0,
  hand: [],
};

export const useGameActions = () => {
  const {
    setup: { client },
    account: { account },
  } = useDojo();

  const createGame = async (modId: string, username: string) => {
    try {
      showTransactionToast();
      const response = await client.game_system.createGame(
        account,
        BigInt(shortString.encodeShortString(modId)),
        BigInt(shortString.encodeShortString(username))
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash, "Creating game...");

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        const events = tx.events;
        console.log(
          "events",
          events.filter((event) => event.keys[1] === CREATE_GAME_EVENT)
        );
        const gameId = getNumberValueFromEvents(events, CREATE_GAME_EVENT, 3);
        console.log("Game " + gameId + " created");
        return {
          gameId,
          hand: getCardsFromEvents(events),
        };
      } else {
        console.error("Error creating game:", tx);
        return createGameEmptyResponse;
      }
    } catch (e) {
      failedTransactionToast();
      console.log(e);
      return createGameEmptyResponse;
    }
  };

  const discard = async (
    gameId: number,
    cards: number[],
    modifiers: { [key: number]: number[] }
  ) => {
    const { modifiers1 } = getModifiersForContract(cards, modifiers);
    try {
      showTransactionToast();
      const response = await client.game_system.discard(
        account,
        gameId,
        cards,
        modifiers1
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        return getPlayEvents(tx.events);
      }
      return;
    } catch (e) {
      failedTransactionToast();
      console.log(e);
      return;
    }
  };

  const changeModifierCard = async (gameId: number, card: number) => {
    try {
      showTransactionToast();
      const response = await client.game_system.changeModifierCard(
        account,
        gameId,
        card
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        return {
          success: true,
          cards: getCardsFromEvents(tx.events),
        };
      } else {
        return {
          success: false,
          cards: [],
        };
      }
    } catch (e) {
      failedTransactionToast();
      console.log(e);
      return {
        success: false,
        cards: [],
      };
    }
  };

  const sellSpecialCard = async (gameId: number, card: number) => {
    try {
      const response = await client.game_system.sellSpecialCard(
        account,
        gameId,
        card
      );
      const transaction_hash = response?.transaction_hash ?? "";

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return tx.isSuccess();
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const play = async (
    gameId: number,
    cards: number[],
    modifiers: { [key: number]: number[] },
    powerUps: number[]
  ) => {
    const { modifiers1 } = getModifiersForContract(cards, modifiers);

    try {
      showTransactionToast();
      const response = await client.game_system.play(
        account,
        gameId,
        cards,
        modifiers1,
        powerUps
      );
      const transaction_hash = response?.transaction_hash ?? "";

      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        const events = tx.events;
        return getPlayEvents(events);
      }
      return;
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return;
    }
  };

  return {
    createGame,
    discard,
    changeModifierCard,
    sellSpecialCard,
    play,
  };
};
