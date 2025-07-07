import { ModCardsConfig } from "../../types/ModConfig";
import { getModRageCardsId, getModSpecialCardsId } from "./useModCardsId";

export const fetchCardsConfig = async (client: any, modId: string) => {
  if (modId) {
    const modSpecialCards = await getModSpecialCardsId(client, modId);
    const modRageCards = await getModRageCardsId(client, modId);

    if (modSpecialCards) {
      const modCardsConfig: ModCardsConfig = {
        specialCardsIds: modSpecialCards,
        rageCardsIds: modRageCards,
      };
      return modCardsConfig;
    }
  }
};
