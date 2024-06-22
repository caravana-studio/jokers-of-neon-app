import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { AccountInterface } from "starknet";
import { CHECK_HAND_EVENT, GAME_ID_EVENT } from "../constants/dojoEventKeys";
import { Plays } from "../enums/plays";
import { getNumberValueFromEvents } from "../utils/getNumberValueFromEvent";
import { getPlayEvents } from "../utils/playEvents/getPlayEvents";
import { ClientComponents } from "./createClientComponents";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";
import { getModifiersForContract } from "./utils/getModifiersForContract";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { client }: { client: IWorld },
  contractComponents: ContractComponents,
  { Card, PokerHandEvent, Game }: ClientComponents
) {
  const createGame = async (account: AccountInterface, username: string) => {
    try {
      const { transaction_hash } = await client.actions.createGame({
        account,
        username,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      if (tx.isSuccess()) {
        const events = tx.events;
        setComponentsFromEvents(contractComponents, getEvents(tx));
        const value = getNumberValueFromEvents(events, GAME_ID_EVENT, 0);
        console.log("Game " + value + " created");
        return value;
      } else {
        console.error("Error creating game:", tx);
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
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
        const play =getNumberValueFromEvents(events, CHECK_HAND_EVENT, 0);
        const multi =getNumberValueFromEvents(events, CHECK_HAND_EVENT, 1);
        const points =getNumberValueFromEvents(events, CHECK_HAND_EVENT, 2);
        setComponentsFromEvents(contractComponents, getEvents(tx));
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
      const { transaction_hash } = await client.actions.discard({
        account,
        gameId,
        cards,
        modifiers1,
        modifiers2,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      setComponentsFromEvents(contractComponents, getEvents(tx));
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const discardEffectCard = async (
    account: AccountInterface,
    gameId: number,
    card: number
  ) => {
    try {
      const { transaction_hash } = await client.actions.discardEffectCard({
        account,
        gameId,
        card,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      setComponentsFromEvents(contractComponents, getEvents(tx));
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
      return false;
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

      setComponentsFromEvents(contractComponents, getEvents(tx));
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const skipShop = async (account: AccountInterface, gameId: number) => {
    try {
      const { transaction_hash } = await client.actions.skipShop({
        account,
        gameId,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      setComponentsFromEvents(contractComponents, getEvents(tx));
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
    }
  };

  const buyCard = async (
    account: AccountInterface,
    gameId: number,
    card_idx: number,
    card_type: number
  ) => {
    try {
      const { transaction_hash } = await client.actions.buyCard({
        account,
        gameId,
        card_idx,
        card_type,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      setComponentsFromEvents(contractComponents, getEvents(tx));
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  const levelUpPokerHand = async (
    account: AccountInterface,
    gameId: number,
    item_id: number
  ) => {
    try {
      const { transaction_hash } = await client.actions.levelUpPokerHand({
        account,
        gameId,
        item_id,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      setComponentsFromEvents(contractComponents, getEvents(tx));
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
      return false;
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
      const { transaction_hash } = await client.actions.play({
        account,
        gameId,
        cards,
        modifiers1,
        modifiers2,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      setComponentsFromEvents(contractComponents, getEvents(tx));

      if (tx.isSuccess()) {
        const events = tx.events;
        return getPlayEvents(events);
      }
      return undefined;
    } catch (e) {
      console.log(e);
    }
  };

  const storeReroll = async (
    account: AccountInterface,
    gameId: number,
  ) => {
    try {
      const { transaction_hash } = await client.actions.storeReroll({
        account,
        gameId,
      });
      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      setComponentsFromEvents(contractComponents, getEvents(tx));
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
      return false;
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
  };
}
