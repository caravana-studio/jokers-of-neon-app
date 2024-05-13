import { Type } from "@dojoengine/recs";
import {
  getEvents,
  parseComponentValue,
  setComponentsFromEvents,
} from "@dojoengine/utils";
import { AccountInterface } from "starknet";
import { Plays } from "../enums/plays";
import { Card } from "../types/Card";
import { ClientComponents } from "./createClientComponents";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { client }: { client: IWorld },
  contractComponents: ContractComponents,
  { Card, PokerHandEvent, Game }: ClientComponents
) {
  const createGame = async (account: AccountInterface) => {
    try {
      const { transaction_hash } = await client.actions.createGame({
        account,
      });

      const tx = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      if (tx.isSuccess()) {
        const events = tx.events;
  
        const gameIdEvent = events?.find((e) => {
          return (
            e.keys[0] ===
            "0xf7ed1ec3a2efb4c4ff4451b344e4a3c4f8bbd6a437e31765a32df3c3a44cdd"
          );
        });
  
        console.log("gameIdEvent", gameIdEvent);
  
        setComponentsFromEvents(contractComponents, getEvents(tx));
  
        const gameIdValue = gameIdEvent?.data.at(0);
        const value = gameIdValue && (parseComponentValue(gameIdValue, Type.Number) as number)
        return value;
      } else {
        return null;
      }

    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const checkHand = async (
    account: AccountInterface,
    gameId: number,
    cards: Card[]
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

      let play: Plays = Plays.NONE;

      if (tx.isSuccess()) {
        const txValue = tx.events?.at(0)?.data.at(0);
        const value =
          txValue && (parseComponentValue(txValue, Type.Number) as number);
        console.log("value", value);
        if (value) {
          play = value;
        }
      }

      setComponentsFromEvents(
        contractComponents,
        getEvents(
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
          })
        )
      );
      return play;
    } catch (e) {
      console.log(e);
    }
  };

  const discard = async (
    account: AccountInterface,
    gameId: number,
    cards: Card[]
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

      setComponentsFromEvents(
        contractComponents,
        getEvents(
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
          })
        )
      );
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    createGame,
    checkHand,
    discard,
  };
}
