const toPositiveInt = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
};

export const getGameConfig = async (client: any, playerAddress: string) => {
  try {
    const tx_result = await client.mods_info_system.getGameConfigForPlayer(
      playerAddress
    );
    return {
      maxPowerUpSlots: toPositiveInt(tx_result.max_power_up_slots),
      maxSpecialCards: toPositiveInt(tx_result.max_special_slots),
    };
  } catch (e) {
    console.log(e);
  }
  return {};
};
