import { AccountInterface } from "starknet";
import { DojoEvents } from "../enums/dojoEvents";
import { getCardsFromEvents } from "../utils/getCardsFromEvents";
import { getEventKey } from "../utils/getEventKey";
import { getPlayEvents } from "../utils/playEvents/getPlayEvents";
import {
  failedTransactionToast,
  showTransactionToast,
  updateTransactionToast,
} from "../utils/transactionNotifications";
import { useDojo } from "./useDojo";

import { achievementSfx } from "../constants/sfx";
import { useAudio } from "../hooks/useAudio";
import { useSettings } from "../providers/SettingsProvider";
import { handleXPEvents } from "../utils/handleXPEvents";
import { getModifiersForContract } from "./utils/getModifiersForContract";
import { SEASON_NUMBER } from "../constants/season";

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

  const { sfxVolume } = useSettings();
  const { play: achievementSound } = useAudio(achievementSfx, sfxVolume);

  const surrenderGame = async (gameId: number) => {
    try {
      showTransactionToast();
      const response = await client.game_system.surrender(
        account,
        BigInt(gameId)
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash, "Surrendering...");

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        console.log("Surrender Game " + gameId);
        return {
          gameId,
        };
      } else {
        console.error("Error surrendering game:", tx);
        return createGameEmptyResponse;
      }
    } catch (e) {
      failedTransactionToast();
      console.log(e);
      return createGameEmptyResponse;
    }
  };

  const transferGame = async (
    new_account: AccountInterface,
    gameId: number,
    username: string
  ) => {
    try {
      showTransactionToast();

      const formattedAddress =
        "0x" + new_account.address.substring(2).padStart(64, "0");

      console.log("Account from transferGame tx ", formattedAddress);
      const response = await client.game_system.transferGame(
        account,
        BigInt(gameId),
        formattedAddress,
        username
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash, "Saving...");

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      if (tx.isSuccess()) {
        console.log("Success in transfer " + gameId);
      } else {
        console.error("Error transfer game:", tx);
      }

      updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      failedTransactionToast();
      console.log(e);
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
        await handleXPEvents(
          tx.value.events,
          achievementSound,
          account.address
        );
        return getPlayEvents(tx.value.events);
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
        await handleXPEvents(
          tx.value.events,
          achievementSound,
          account.address
        );
        return {
          success: true,
          cards: getCardsFromEvents(tx.value.events),
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

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleXPEvents(
          tx.value.events,
          achievementSound,
          account.address
        );
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
    }
  };

  const sellPowerup = async (gameId: number, powerupIdx: number) => {
    try {
      const response = await client.shop_system.sellPowerUp(
        account,
        gameId,
        powerupIdx
      );
      const transaction_hash = response?.transaction_hash ?? "";

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      if (tx.isSuccess()) {
        await handleXPEvents(
          tx.value.events,
          achievementSound,
          account.address
        );
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return { success: false };
    }
  };

  const claimLives = async (seasonId = SEASON_NUMBER) => {
    try {
      const response = await client.lives_system.claim(account, seasonId);
      const transaction_hash = response?.transaction_hash ?? "";

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      const success = updateTransactionToast(transaction_hash, tx.isSuccess());

      return { success };
    } catch (e) {
      console.log(e);
      return { success: false };
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
      const response = await client.play_system.play(
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
        const events = tx.value.events;

        await handleXPEvents(
          tx.value.events,
          achievementSound,
          account.address
        );
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
    discard,
    changeModifierCard,
    sellSpecialCard,
    sellPowerup,
    play,
    surrenderGame,
    transferGame,
    claimLives
  };
};
