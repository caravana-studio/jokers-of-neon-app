import { CairoOption, CairoOptionVariant, shortString } from "starknet";
import { DojoEvents } from "../enums/dojoEvents";
import { getCardsFromEvents } from "../utils/getCardsFromEvents";
import { getEventKey } from "../utils/getEventKey";
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

const CREATE_GAME_EVENT_KEY = getEventKey(DojoEvents.CREATE_GAME);

const MINT_GAME_EVENT_KEY =
  import.meta.env.VITE_MINT_GAME_EVENT_KEY ||
  "0x2f01dd863550300355e99ebfc08524ac0d60d424c59eda114a54140df28d8ac";

export const useGameActions = () => {
  const {
    setup: { client },
    account: { account },
  } = useDojo();

  const createGame = async (gameId: number, username: string) => {
    try {
      showTransactionToast();
      const response = await client.game_system.startGame(
        account,
        BigInt(gameId),
        BigInt(shortString.encodeShortString(username)),
        new CairoOption(CairoOptionVariant.None)
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
          events.filter((event) => event.keys[1] === CREATE_GAME_EVENT_KEY)
        );
        const gameId = getNumberValueFromEvents(
          events,
          CREATE_GAME_EVENT_KEY,
          3
        );
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
      const response = await client.action_system.discard(
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
      const response = await client.action_system.changeModifierCard(
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
      const response = await client.shop_system.sellSpecialCard(
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
      const response = await client.action_system.play(
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

  const mintGame = async (username: string) => {
    try {
      showTransactionToast();
      const response = await client.game_system.mint(
        account,
        BigInt(shortString.encodeShortString(username)),
        BigInt(0),
        new CairoOption(CairoOptionVariant.None),
        new CairoOption(CairoOptionVariant.None),
        account.address
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash, "Minting game...");

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        const events = tx.events;
        const gameId =
          getNumberValueFromEvents(events, MINT_GAME_EVENT_KEY, 3) ||
          getNumberValueFromEvents(events, MINT_GAME_EVENT_KEY, 2, 0);
        console.log("Game " + gameId + " minted");
        return gameId;
      } else {
        console.error("Error minting game:", tx);
        return 0;
      }
    } catch (e) {
      failedTransactionToast();
      console.log(e);
      return 0;
    }
  };

  return {
    createGame,
    discard,
    changeModifierCard,
    sellSpecialCard,
    play,
    mintGame,
  };
};
