import { shortString } from "starknet";

export const getGameConfig = async (client: any, modId: string) => {
  try {
    let tx_result = await client.game_system.getGameConfig(shortString.encodeShortString(modId));
    return {
      maxPowerUpSlots: parseInt(tx_result.max_power_up_slots),
      maxSpecialCards: parseInt(tx_result.max_special_slots),
    };
  } catch (e) {
    console.log(e);
  }
  return { maxPowerUpSlots: 4, maxSpecialCards: 7 }; 
};
