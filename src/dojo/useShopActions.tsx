import { getCardsFromEvents } from "../utils/getCardsFromEvents";
import { failedTransactionToast, showTransactionToast, updateTransactionToast } from "../utils/transactionNotifications";
import { useDojo } from "./useDojo";
  
export const useShopActions = () => {
    const {
        setup: {
          client,
        },
        account: { account },
      } = useDojo(); 

      const skipShop = async (game_id: number) => {
        try {
          showTransactionToast();
          const { transaction_hash } = await client.shop_system.skip_shop({
            account,
            game_id,
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
        game_id: number,
        card_idx: number,
        card_type: number
      ) => {
        try {
          showTransactionToast();
          const { transaction_hash } = await client.shop_system.buy_card_item({
            account,
            game_id,
            item_id: card_idx,
            card_item_type: card_type,
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
        game_id: number,
        pack_id: number
      ) => {
        try {
          showTransactionToast();
          const { transaction_hash } = await client.shop_system.buy_blister_pack_item({
            account,
            game_id,
            blister_pack_item_id: pack_id,
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
        game_id: number,
        cards_index: number[]
      ) => {
        try {
          showTransactionToast();
          const { transaction_hash } = await client.shop_system.select_cards_from_blister({
            account,
            game_id,
            cards_index,
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
        game_id: number,
        item_id: number
      ) => {
        try {
          showTransactionToast();
          const { transaction_hash } = await client.shop_system.buy_poker_hand_item({
            account,
            game_id,
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

      const storeReroll = async (game_id: number) => {
        try {
          showTransactionToast();
          const { transaction_hash } = await client.shop_system.reroll({
            account,
            game_id,
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
        skipShop,
        buyCard,
        buyPack,
        selectCardsFromPack,
        levelUpPokerHand,
        storeReroll,
      };
    };
      
