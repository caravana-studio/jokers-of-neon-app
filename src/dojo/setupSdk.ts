import { useEffect } from 'react';
import { createDojoStore } from '@dojoengine/sdk';
import { Schema } from '../dojo/typescript/bindings';
import { GAME_ID } from '../constants/localStorage';
import { useDojo } from './useDojo';

export const useDojoStore = createDojoStore<Schema>();

export const useEntityService = () => {
  const state = useDojoStore((state) => state);
  let gameID = localStorage.getItem(GAME_ID) || '';

  const {sdk} = useDojo();

  const fetchEntities = async () => {
    try {
      await sdk.getEntities(
        {
          jokers_of_neon: {
            DeckCard: {
              $: {
                where: {
                  game_id: {
                    $eq: Number(gameID),
                  },
                  idx: {
                    $gte: 0,
                  },
                },
              },
            },
          },
        },
        (resp) => {
          if (resp.error) {
            console.error('resp.error.message:', resp.error.message);
            return;
          }
          if (resp.data) {
            console.log(resp.data);
            state.setEntities(resp.data);
          }
        },
        10000, 0
      );
    } catch (error) {
      console.error('Error querying entities:', error);
    }
  };

  const subscribeEntities = async () => {
    let unsubscribe: (() => void) | undefined;
    try {
      const subscription = await sdk.subscribeEntityQuery(
        {
          jokers_of_neon: {
            DeckCard: {
              $: {
                where: {
                  game_id: {
                    $is: Number(gameID),
                  },
                },
              },
            },
          },
        },
        (response) => {
          if (response.error) {
            console.error('Error setting up entity sync:', response.error);
          } else if (response.data && response.data[0].entityId !== '0x0') {
            state.setEntities(response.data);
            console.log(response.data);
          }
        },
        { logging: false }
      );
      unsubscribe = () => subscription.cancel();
    } catch (error) {
      console.error('Error subscribing to entities:', error);
    }
    return unsubscribe;
  };

  useEffect(() => {
    // Automatically fetch entities when gameID changes
    fetchEntities();
    subscribeEntities();

    // // Cleanup subscriptions on unmount
    // return () => {
    //   if (unsubscribe) {
    //     unsubscribe();
    //   }
    // };
  }, [sdk, gameID]);

  return {
    fetchEntities,
    subscribeEntities,
  };
};