export const getNode = async (
  client: any,
  gameId: number,
  nodeId: number
): Promise<number> => {
  try {
    console.log("calling with nodeId", nodeId);
    let tx_result = await client.map_system.getNode(gameId, nodeId);
    console.log("tx_result", tx_result);
    return Number(tx_result.data);
  } catch (e) {
    console.log(e);
    return 0;
  }
};
