const toPositiveInt = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
};

export const getGameConfig = async (
  client: any,
  encodedModId: string,
  gameId?: number
) => {
  try {
    console.log('gameconfig gameId', gameId)
    const tx_result =
      gameId === undefined
        ? await client.mods_info_system.getGameConfig(encodedModId)
        : await client.mods_info_system.getGameConfig(encodedModId, gameId);
        console.log('gameconfig tx_result', tx_result)
    return {
      maxPowerUpSlots: toPositiveInt(tx_result.max_power_up_slots),
      maxSpecialCards: toPositiveInt(tx_result.max_special_slots),
    };
  } catch (e) {
    // Backward compatibility with environments still exposing the old 1-arg signature.
    if (gameId !== undefined) {
      try {
        const tx_result = await client.mods_info_system.getGameConfig(
          encodedModId
        );
        return {
          maxPowerUpSlots: toPositiveInt(tx_result.max_power_up_slots),
          maxSpecialCards: toPositiveInt(tx_result.max_special_slots),
        };
      } catch (fallbackError) {
        console.log(fallbackError);
      }
    } else {
      console.log(e);
    }
  }
  return {};
};
