import {
  getEvents,
  setComponentsFromEvents
} from "@dojoengine/utils";
import { AccountInterface } from "starknet";
import { GAME_ID_EVENT, PLAY_SCORE_EVENT } from "../constants/dojoEventKeys";
import { Plays } from "../enums/plays";
import { Card } from "../types/Card";
import { getNumberValueFromEvent, getNumberValueFromEvents } from "../utils/getNumberValueFromEvent";
import { ClientComponents } from "./createClientComponents";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";
import { getScoreData } from "../utils/getScoreData";

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
        setComponentsFromEvents(contractComponents, getEvents(tx));
        const value = getNumberValueFromEvents(events, GAME_ID_EVENT, 0)
        console.log("Game " + value + " created");
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
        const event = tx.events?.at(0)
        const value = event && getNumberValueFromEvent(event, 0)
        console.log("play", value);
        if (value) {
          play = value;
        }
      }

      setComponentsFromEvents(contractComponents, getEvents(tx));
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

      setComponentsFromEvents(contractComponents, getEvents(tx));
      return tx.isSuccess();
    } catch (e) {
      console.log(e);
    }
  };

  const play = async (
    account: AccountInterface,
    gameId: number,
    cards: Card[]
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
        const events = tx.events
        return getScoreData(events)
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
    play,
  };
}
