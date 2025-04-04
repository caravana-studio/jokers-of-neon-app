
const POINTS_IDX = 0;
const MULTI_IDX = 1;
const CASH_IDX = 2;

export const getSpecialCardInfo = async (
  client: any,
  modId: string,
  gameId: number,
  specialCardId: number
) => {
  if (gameId != 0 && modId && specialCardId) {
    try {
      let tx_result = await client.mods_info_system.getCumulativeInfo(
        modId,
        gameId,
        specialCardId
      );
      console.log(tx_result);
      console.log("result", {
        points: parseInt(tx_result[POINTS_IDX]),
        multi: parseInt(tx_result[MULTI_IDX]),
        cash: parseInt(tx_result[CASH_IDX]),
      });

      return {
        points: parseInt(tx_result[POINTS_IDX]),
        multi: parseInt(tx_result[MULTI_IDX]),
        cash: parseInt(tx_result[CASH_IDX]),
      };
    } catch (e) {
      console.log(e);
    }
    return {
      points: 0,
      multi: 0,
      cash: 0,
    };
  }
};
