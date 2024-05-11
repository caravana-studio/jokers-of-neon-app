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

      const events = getEvents(
        tx
      )

      console.log("create game tx", tx);
      console.log('events', events)
      
      setComponentsFromEvents(
        contractComponents,
        events
      );
      return !!tx.isSuccess();
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const checkHand = async (account: AccountInterface, cards: Card[]) => {
    /*         const entityId = getEntityIdFromKeys([
            BigInt(account.address),
        ]) as Entity; */

    // const positionId = uuid();
    /*         Position.addOverride(positionId, {
            entity: entityId,
            value: { player: BigInt(entityId), vec: { x: 10, y: 10 } },
        }); */

    // const movesId = uuid();
    /*         Moves.addOverride(movesId, {
            entity: entityId,
            value: {
                player: BigInt(entityId),
                remaining: 100,
                last_direction: 0,
            },
        }); */

    try {
      const { transaction_hash } = await client.actions.checkHand({
        account,
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
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    } finally {
      // Position.removeOverride(positionId);
      // Moves.removeOverride(movesId);
    }
  };
  /* 
    const move = async (account: AccountInterface, direction: Direction) => {
        const entityId = getEntityIdFromKeys([
            BigInt(account.address),
        ]) as Entity;

        const positionId = uuid();
        Position.addOverride(positionId, {
            entity: entityId,
            value: {
                player: BigInt(entityId),
                vec: updatePositionWithDirection(
                    direction,
                    getComponentValue(Position, entityId) as any
                ).vec,
            },
        });

        const movesId = uuid();
        Moves.addOverride(movesId, {
            entity: entityId,
            value: {
                player: BigInt(entityId),
                remaining:
                    (getComponentValue(Moves, entityId)?.remaining || 0) - 1,
            },
        });

        try {
            const { transaction_hash } = await client.actions.move({
                account,
                direction,
            });

            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
            Position.removeOverride(positionId);
            Moves.removeOverride(movesId);
        } finally {
            Position.removeOverride(positionId);
            Moves.removeOverride(movesId);
        }
    }; */

  return {
    createGame,
    checkHand,
    // move,
  };
}
