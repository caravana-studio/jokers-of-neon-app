const getModCardsId = async (client: any, modId: string, method: "getSpecialCardsIds" | "getRageCardsIds") => {
  try {
    const tx_result = await client.mods_info_system[method](modId);
    return tx_result.map((cardId: any) => parseInt(cardId));
  } catch {
    return [];
  }
};

export const getModSpecialCardsId = (client: any, modId: string) => getModCardsId(client, modId, "getSpecialCardsIds");

export const getModRageCardsId = (client: any, modId: string) => getModCardsId(client, modId, "getRageCardsIds");