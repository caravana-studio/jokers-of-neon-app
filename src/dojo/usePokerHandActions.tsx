import { failedTransactionToast, showTransactionToast, updateTransactionToast } from "../utils/transactionNotifications";
import { PokerHand } from "./typescript/models.gen";
import { useDojo } from "./useDojo";

export const usePokerHandActions = () => {
    const {
        setup: {
          client,
        },
        account: { account },
      } = useDojo(); 

      const getLevelPokerHand = async (poker_hand: PokerHand, level: number) => {
        try {
          showTransactionToast();
          const { transaction_hash } = await client.poker_hand_system.getLevelPokerHand({
            account,
            poker_hand,
            level
          });
          showTransactionToast(transaction_hash);
    
          const tx = await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
          });
    
          updateTransactionToast(transaction_hash, tx.isSuccess());
          if (tx.isSuccess()) {
            return {
              success: true,
              poker_hand: tx.value,
            };
          } else {
            return {
              success: false,
              poker_hand: [],
            };
          }
        } catch (e) {
          failedTransactionToast();
          console.log(e);
          return {
            success: false,
            poker_hand: [],
          };
        }
      };

    return {
      getLevelPokerHand,
  };
};