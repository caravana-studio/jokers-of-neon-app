import { PokerHandTracker } from "./typescript/models.gen";

export const getPlayerPokerHandTracker = async (
  client: any,
  gameId: number
) => {
  if (gameId != 0) {
    try {
      let tx_result =
        await client.poker_hand_system.getPlayerPokerHandsTracker(gameId);
      return tx_result as PokerHandTracker;
    } catch (e) {
      console.log(e);
    }
  }
};
