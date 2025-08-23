import {
  AccountInterface,
  CairoOption,
  CairoOptionVariant,
  shortString,
} from "starknet";
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

import { achievementSfx } from "../constants/sfx";
import { useAudio } from "../hooks/useAudio";
import { useSettings } from "../providers/SettingsProvider";
import { handleAchievements } from "../utils/handleAchievements";
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

  const { sfxVolume } = useSettings();
  const { play: achievementSound } = useAudio(achievementSfx, sfxVolume);

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
        const events = tx.value.events;
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

        await handleAchievements(tx.value.events, achievementSound);

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

  const approve = async (gameId: number) => {
    try {
      showTransactionToast();
      const gameSystem =
        "0x58b99b49cc26fcfe3ef65dffdb75f5c31f1e281567ed98618b815363bd203b6";

      const response = await client.game_system.approve(
        account,
        gameSystem,
        gameId
      );
      const transaction_hash = response?.transaction_hash ?? "";
      showTransactionToast(transaction_hash, "Approving...");

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      if (tx.isSuccess()) {
        console.log("Success in approve " + gameId);
      } else {
        console.error("Error approve game:", tx);
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
        await handleAchievements(tx.value.events, achievementSound);
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
        await handleAchievements(tx.value.events, achievementSound);
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
        await handleAchievements(tx.value.events, achievementSound);
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
        await handleAchievements(tx.value.events, achievementSound);
      }

      return { success };
    } catch (e) {
      console.log(e);
      failedTransactionToast();
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

        await handleAchievements(tx.value.events, achievementSound);
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
        const events = tx.value.events;
        const gameId =
          getNumberValueFromEvents(events, MINT_GAME_EVENT_KEY, 3) ||
          getNumberValueFromEvents(events, MINT_GAME_EVENT_KEY, 2, 0);
        console.log("Game " + gameId + " minted");

        await handleAchievements(tx.value.events, achievementSound);

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
    sellPowerup,
    play,
    mintGame,
    surrenderGame,
    transferGame,
    approve,
  };
};
