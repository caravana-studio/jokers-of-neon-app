export const getHandCards = async (
  client: any,
  gameId: number
): Promise<any> => {
  try {
    let tx_result: any = await client.game_system.getHandCards(
      gameId
    );

    console.log("game cards", tx_result);

    return;
  } catch (e) {
    console.log(e);
    return;
  }
};
