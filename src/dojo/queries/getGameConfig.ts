
export const getGameConfig = async (client: any, encodedModId: string) => {
  const safeToNumber = (
    value: unknown,
    fallback: number,
    min: number = 0
  ) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= min ? parsed : fallback;
  };

  try {
    let tx_result = await client.mods_info_system.getGameConfig(encodedModId);
    return {
      maxPowerUpSlots: safeToNumber(tx_result?.max_power_up_slots, 4, 1),
      maxSpecialCards: safeToNumber(tx_result?.max_special_slots, 7, 1),
    };
  } catch (e) {
    console.log(e);
  }
  return { maxPowerUpSlots: 4, maxSpecialCards: 7 };
};
