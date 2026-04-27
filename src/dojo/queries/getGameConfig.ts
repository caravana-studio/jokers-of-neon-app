const toPositiveInt = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
};

const toNonNegativeInt = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
};

const DEFAULT_CONFIG = {
  maxPowerUpSlots: 4,
  maxSpecialCards: 7,
};

export const getGameConfig = async (client: any, playerAddress: string) => {
  try {
    const tx_result =
      await client.mods_info_system.getGameConfigForPlayer(playerAddress);
    return {
      maxPowerUpSlots: toNonNegativeInt(tx_result.max_power_up_slots),
      maxSpecialCards: toPositiveInt(tx_result.max_special_slots),
    };
  } catch (e) {
    console.log(e, "returning default config", DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  return {};
};
