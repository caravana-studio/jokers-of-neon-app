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
import { AppType, useAppContext } from "../providers/AppContextProvider";
import { useSettings } from "../providers/SettingsProvider";
import { handleXPEvents } from "../utils/handleXPEvents";
import {
  logFailedTransactionReceipt,
  logTransactionError,
} from "../utils/logTransactionError";
import { getModifiersForContract } from "./utils/getModifiersForContract";
import { getSeasonNumber } from "../constants/season";
import { useUsername } from "./utils/useUsername";

const createGameEmptyResponse = {
  gameId: 0,
  hand: [],
};

const CREATE_GAME_EVENT_KEY = getEventKey(DojoEvents.CREATE_GAME);

const MINT_GAME_EVENT_KEY =
  import.meta.env.VITE_MINT_GAME_EVENT_KEY ||
  "0x2f01dd863550300355e99ebfc08524ac0d60d424c59eda114a54140df28d8ac";

type TransactionResult = { success: boolean };

const inFlightClaimLivesByAccount = new Map<string, Promise<TransactionResult>>();

export const useGameActions = () => {
  const appType = useAppContext();
  const shouldShowXpToasts = appType !== AppType.MINIAPP;
  const {
    setup: { client },
    account: { account },
    accountType,
  } = useDojo();
  const username = useUsername();

  const { sfxVolume } = useSettings();
  const { play: achievementSound } = useAudio(achievementSfx, sfxVolume);

  const logActionError = (
    action: string,
    error: unknown,
    context: Record<string, unknown> = {}
  ) => {
    logTransactionError(`Game action failed: ${action}`, error, {
      accountAddress: account.address,
      accountType,
      ...context,
    });
  };

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
        logFailedTransactionReceipt("Game action reverted: surrenderGame", tx, {
          accountAddress: account.address,
          accountType,
          gameId,
          transactionHash: transaction_hash,
        });
        return createGameEmptyResponse;
      }
    } catch (e) {
      failedTransactionToast();
      logActionError("surrenderGame", e, { gameId });
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
        logFailedTransactionReceipt("Game action reverted: transferGame", tx, {
          accountAddress: account.address,
          accountType,
          gameId,
          transactionHash: transaction_hash,
          newAccountAddress: new_account.address,
        });
      }

      updateTransactionToast(transaction_hash, tx.isSuccess());
    } catch (e) {
      failedTransactionToast();
      logActionError("transferGame", e, {
        gameId,
        newAccountAddress: new_account.address,
      });
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
          account.address,
          accountType,
          username,
          shouldShowXpToasts
        );
        return getPlayEvents(tx.value.events);
      }
      return;
    } catch (e) {
      failedTransactionToast();
      logActionError("discard", e, { gameId, cards, modifiers, modifiers1 });
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
          account.address,
          accountType,
          username,
          shouldShowXpToasts
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
      logActionError("changeModifierCard", e, { gameId, card });
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
          account.address,
          accountType,
          username,
          shouldShowXpToasts
        );
      }

      return { success };
    } catch (e) {
      logActionError("sellSpecialCard", e, { gameId, card });
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
          account.address,
          accountType,
          username,
          shouldShowXpToasts
        );
      }

      return { success };
    } catch (e) {
      logActionError("sellPowerup", e, { gameId, powerupIdx });
      failedTransactionToast();
      return { success: false };
    }
  };

  const claimLives = async (seasonId = getSeasonNumber()) => {
    const claimKey = `${account.address}:${seasonId}`;
    const inFlightClaim = inFlightClaimLivesByAccount.get(claimKey);
    if (inFlightClaim) {
      console.log("[claimLives] Reusing in-flight claim", {
        address: account.address,
        seasonId,
      });
      return inFlightClaim;
    }

    const claimPromise = (async (): Promise<TransactionResult> => {
      try {
        const response = await client.lives_system.claim(account, seasonId);
        const transaction_hash = response?.transaction_hash ?? "";

        const tx = await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        });

        const success = updateTransactionToast(transaction_hash, tx.isSuccess());

        return { success };
      } catch (e) {
        logActionError("claimLives", e, { seasonId });
        return { success: false };
      }
    })().finally(() => {
      inFlightClaimLivesByAccount.delete(claimKey);
    });

    inFlightClaimLivesByAccount.set(claimKey, claimPromise);
    return claimPromise;
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
          account.address,
          accountType,
          username,
          shouldShowXpToasts
        );
        return getPlayEvents(events);
      }
      return;
    } catch (e) {
      logActionError("play", e, { gameId, cards, modifiers, modifiers1, powerUps });
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
