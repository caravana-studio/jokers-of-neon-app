import { AccountInterface } from "starknet";
import {
  CHECK_HAND_EVENT,
  GAME_ID_EVENT,
  GAME_OVER_EVENT,
} from "../constants/dojoEventKeys";
import { Plays } from "../enums/plays";
import { getCardsFromEvents } from "../utils/getCardsFromEvents";
import { getNumberValueFromEvents } from "../utils/getNumberValueFromEvent";
import { getPlayEvents } from "../utils/playEvents/getPlayEvents";
import {
  failedTransactionToast,
  showTransactionToast,
  updateTransactionToast,
} from "../utils/transactionNotifications.tsx";
import { ClientComponents } from "./createClientComponents";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";
import { getModifiersForContract } from "./utils/getModifiersForContract";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

const createGameEmptyResponse = {
  gameId: 0,
  hand: [],
};

export function createSystemCalls(
  { client }: { client: IWorld },
  contractComponents: ContractComponents,
  { Card, Game }: ClientComponents
) {
  const createGame = async (account: AccountInterface, username: string) => {
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.createGame({
        account,
        username,
      });
      showTransactionToast(transaction_hash, "Creating game...");

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        const events = tx.events;
        const gameId = getNumberValueFromEvents(events, GAME_ID_EVENT, 0);
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

  const checkHand = async (
    account: AccountInterface,
    gameId: number,
    cards: number[],
    modifiers: { [key: number]: number[] }
  ) => {
    try {
      const { modifiers1, modifiers2 } = getModifiersForContract(
        cards,
        modifiers
      );
      const { transaction_hash } = await client.actions.checkHand({
        account,
        gameId,
        cards,
        modifiers1,
        modifiers2,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      if (tx.isSuccess()) {
        const events = tx.events;
        const play = getNumberValueFromEvents(events, CHECK_HAND_EVENT, 0);
        const multi = getNumberValueFromEvents(events, CHECK_HAND_EVENT, 1);
        const points = getNumberValueFromEvents(events, CHECK_HAND_EVENT, 2);
        return {
          play,
          multi,
          points,
        };
      }

      return {
        play: Plays.NONE,
        multi: 0,
        points: 0,
      };
    } catch (e) {
      console.log(e);
    }
  };

  const discard = async (
    account: AccountInterface,
    gameId: number,
    cards: number[],
    modifiers: { [key: number]: number[] }
  ) => {
    const { modifiers1, modifiers2 } = getModifiersForContract(
      cards,
      modifiers
    );
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.discard({
        account,
        gameId,
        cards,
        modifiers1,
        modifiers2,
      });
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        return {
          success: true,
          cards: getCardsFromEvents(tx.events),
          gameOver: !!tx.events.find(
            (event) => event.keys[0] === GAME_OVER_EVENT
          ),
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

  const discardEffectCard = async (
    account: AccountInterface,
    gameId: number,
    card: number
  ) => {
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.discardEffectCard({
        account,
        gameId,
        card,
      });
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

  const discardSpecialCard = async (
    account: AccountInterface,
    gameId: number,
    card: number
  ) => {
    try {
      const { transaction_hash } = await client.actions.discardSpecialCard({
        account,
        gameId,
        card,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      return tx.isSuccess();
    } catch (e) {
      console.log(e);
      return failedTransactionToast();
    }
  };

  const skipShop = async (account: AccountInterface, gameId: number) => {
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.skipShop({
        account,
        gameId,
      });
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

  const buyCard = async (
    account: AccountInterface,
    gameId: number,
    card_idx: number,
    card_type: number
  ) => {
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.buyCard({
        account,
        gameId,
        card_idx,
        card_type,
      });
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

  const buyPack = async (
    account: AccountInterface,
    gameId: number,
    pack_id: number
  ) => {
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.buyPack({
        account,
        gameId,
        pack_id,
      });
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

  const selectCardsFromPack = async (
    account: AccountInterface,
    gameId: number,
    cardIndexes: number[]
  ) => {
    console.log("selectCardsFromPack", cardIndexes);
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.selectCardsFromPack({
        account,
        gameId,
        cardIndexes,
      });
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

  const levelUpPokerHand = async (
    account: AccountInterface,
    gameId: number,
    item_id: number
  ) => {
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.levelUpPokerHand({
        account,
        gameId,
        item_id,
      });
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

  const play = async (
    account: AccountInterface,
    gameId: number,
    cards: number[],
    modifiers: { [key: number]: number[] }
  ) => {
    const { modifiers1, modifiers2 } = getModifiersForContract(
      cards,
      modifiers
    );
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.play({
        account,
        gameId,
        cards,
        modifiers1,
        modifiers2,
      });
      showTransactionToast(transaction_hash);

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      updateTransactionToast(transaction_hash, tx.isSuccess());
      if (tx.isSuccess()) {
        const events = tx.events;
        console.log('events', events.filter((event) => event.data.length === 4))
        return getPlayEvents(events);
      }
      return;
    } catch (e) {
      console.log(e);
      failedTransactionToast();
      return;
    }
  };

  const storeReroll = async (account: AccountInterface, gameId: number) => {
    try {
      showTransactionToast();
      const { transaction_hash } = await client.actions.storeReroll({
        account,
        gameId,
      });
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
    createGame,
    checkHand,
    discard,
    discardEffectCard,
    discardSpecialCard,
    play,
    skipShop,
    buyCard,
    levelUpPokerHand,
    storeReroll,
    buyPack,
    selectCardsFromPack,
  };
}
