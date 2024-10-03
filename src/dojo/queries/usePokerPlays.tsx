import {
    getComponentValue,
    Has,
  } from "@dojoengine/recs";
import { PlayerLevelPokerHand } from "../typescript/models.gen";
import { useEffect, useState } from "react";
import { useDojo } from "../useDojo";
import { useEntityQuery } from "@dojoengine/react";
import { usePokerHandActions } from "../usePokerHandActions.tsx"
export const usePokerPlays = (gameId: number): { plays: PlayerLevelPokerHand[] } => {
  const [plays, setPlays] = useState<PlayerLevelPokerHand[]>([]); // Typed state
  const { getLevelPokerHand } = usePokerHandActions();

  const {
      setup: {
          clientComponents: {
              PlayerLevelPokerHand
          }
      },
  } = useDojo();
  const gameKeys = useEntityQuery([Has(PlayerLevelPokerHand)]);

  useEffect(() => {
    const components = gameKeys
        .map((entity) => {
            const component = getComponentValue(PlayerLevelPokerHand, entity);
            if (!component) return undefined;
            return component;
        })
        .filter((component): component is PlayerLevelPokerHand => component?.game_id === gameId);
  
        // plays.map(async (poker_hand) => {
        //   console.log("plays.map: ", poker_hand)
        //         const poker_hand_data = await getLevelPokerHand(
        //             poker_hand.poker_hand,
        //             poker_hand.level as number
        //         );
        //         console.log("poker_hand_data: ", poker_hand_data)

        //         if (poker_hand_data.success) {
        //             // Update the poker_hand with the received data
        //             return {
        //                 ...poker_hand,
        //                 points: poker_hand_data.poker_hand.points,
        //                 multi: poker_hand_data.poker_hand.multi,
        //             };
        //         }
        //     return poker_hand;
        // })

    setPlays(components);
  }, [gameKeys, gameId]);

  console.log("plays: Object.values(plays) ", Object.values(plays));
  return { plays: Object.values(plays) };
};