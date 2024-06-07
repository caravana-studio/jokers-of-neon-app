import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { AccountInterface } from "starknet";
import { GAME_ID_EVENT } from "../constants/dojoEventKeys";
import { Plays } from "../enums/plays";
import {
  getNumberValueFromEvent,
  getNumberValueFromEvents,
} from "../utils/getNumberValueFromEvent";
import { getPlayEvents } from "../utils/getPlayEvents";
import { ClientComponents } from "./createClientComponents";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";

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
    cards: number[]
  ) => {
    try {
      const { transaction_hash } = await client.actions.checkHand({
        account,
        gameId,
        cards,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      if (tx.isSuccess()) {
        const event = tx.events?.at(0);
        const play = event && getNumberValueFromEvent(event, 0);
        const multi = event && getNumberValueFromEvent(event, 1);
        const points = event && getNumberValueFromEvent(event, 2);
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
    cards: number[]
  ) => {
    try {
      const { transaction_hash } = await client.actions.discard({
        account,
        gameId,
        cards,
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
    }
  };

  const play = async (
    account: AccountInterface,
    gameId: number,
    cards: number[]
  ) => {
    try {
      const { transaction_hash } = await client.actions.play({
        account,
        gameId,
        cards,
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

  return {
    createGame,
    checkHand,
    discard,
    discardEffectCard,
    play,
  };
}
