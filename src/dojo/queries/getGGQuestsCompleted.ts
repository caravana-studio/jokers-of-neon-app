
export const getGGQuestsCompleted = async (client: any, playerAddress: string) => {
  try {
    let tx_result = await client.gg_sync_system.getQuestsCompleted(playerAddress);
    console.log(tx_result);
    //TODO convert to array
    return tx_result
  } catch (e) {
    console.log(e);
  }
  return []; 
};
