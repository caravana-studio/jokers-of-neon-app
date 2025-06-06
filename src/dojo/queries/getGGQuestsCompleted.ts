import { BigNumberish, shortString } from "starknet";

export const getGGQuestsCompleted = async (
  client: any,
  playerAddress: string
) => {
  try {
    let tx_result =
      await client.gg_sync_system.getQuestsCompleted(playerAddress);
    return tx_result.map((questId: BigNumberish) =>
      shortString.decodeShortString(questId.toString())
    );
  } catch (e) {
    console.log("Error getting GG Quests Completed", e);
  }
  return [];
};
