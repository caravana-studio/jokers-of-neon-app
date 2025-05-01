export const getNode = async (
  client: any,
  gameId: number,
  nodeId: number
): Promise<number> => {
  try {
    let tx_result = await client.map_system.getNode(gameId, nodeId);
    return Number(tx_result.data);
  } catch (e) {
    console.log(e);
    return 0;
  }
};
