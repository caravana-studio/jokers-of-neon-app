export const getMap = async (
  client: any,
  gameId: number,
  level: number
) => {
  try {
    let tx_result = await client.map_system.getLevelMap(gameId, level);
    console.log("tx_result", tx_result);
  } catch (e) {
    console.log(e);
  }
};
