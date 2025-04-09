
const POINTS_IDX = 0;
const MULTI_IDX = 1;
const CASH_IDX = 2;

export interface SpecialCardInfo {
  points: number
  multi: number
  cash: number
}

export const getSpecialCardInfo = async (
  client: any,
  modId: string,
  gameId: number,
  specialCardId: number
): Promise<SpecialCardInfo> => {
  if (gameId != 0 && modId && specialCardId) {
    try {
      const tx_result = await client.mods_info_system.getCumulativeInfo(
        modId,
        gameId,
        specialCardId
      );
      return {
        points: parseInt(tx_result[POINTS_IDX]),
        multi: parseInt(tx_result[MULTI_IDX]),
        cash: parseInt(tx_result[CASH_IDX]),
      };
    } catch (e) {
      console.log(e);
    }
  }
  return {
    points: 0,
    multi: 0,
    cash: 0,
  };
};
