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

  // First effect to get the initial poker hands based on gameKeys
  useEffect(() => {
      const components = gameKeys
          .map((entity) => {
              const component = getComponentValue(PlayerLevelPokerHand, entity);
              if (!component) return undefined;
              return component;
          })
          .filter((component): component is PlayerLevelPokerHand => component?.game_id === gameId); // Type guard to ensure proper typing
   
      setPlays(components);
  }, [gameKeys, gameId]);

  // Second effect to fetch data from getPokerHand asynchronously
  useEffect(() => {
      const fetchPokerHands = async () => {
          const updatedPlays = await Promise.all(
              plays.map(async (poker_hand) => {
                console.log("plays.map: ", poker_hand)
                      const poker_hand_data = await getLevelPokerHand(
                          poker_hand.poker_hand,
                          poker_hand.level as number
                      );
                      console.log("poker_hand_data: ", poker_hand_data)

                      if (poker_hand_data.success) {
                          // Update the poker_hand with the received data
                          return {
                              ...poker_hand,
                              points: poker_hand_data.poker_hand.points,
                              multi: poker_hand_data.poker_hand.multi,
                          };
                      }
                  return poker_hand;
              })
          );

          setPlays(updatedPlays); // Update state with new data
      };

      if (plays.length > 0) {
          fetchPokerHands(); // Fetch only when there are plays
      }
  }, [gameId, getLevelPokerHand]); // Removed 'plays' as a dependency to avoid the infinite loop

  console.log("plays: Object.values(plays) ", Object.values(plays));

  return { plays };
};