import { powerupStyles } from "../../constants/powerupStyles";

export const getPowerUps = async (
  client: any,
  gameId: number
): Promise<any> => {
  try {
    const tx_result: BigInt[] = await client.game_views.getPowerUps(gameId);
    const powerUps = tx_result.map((powerUpId: BigInt, index: number) => {
      return getPowerUp(Number(powerUpId), index, gameId);
    });
    return powerUps.filter((powerUp: any) => powerUp.power_up_id !== 9999);
  } catch (e) {
    console.log(e);
    return;
  }
};

export const getPowerUp = (
  power_up_id: number,
  idx: number,
  game_id: number = 0
) => {
  return {
    power_up_id,
    img: `/powerups/${power_up_id}.png`,
    idx,
    cost: 0,
    discount_cost: 0,
    purchased: false,
    fieldOrder: [],
    game_id,
    style: powerupStyles[power_up_id],
  };
};
