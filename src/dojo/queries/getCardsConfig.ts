import { ModCardsConfig } from "../../types/ModConfig";
import { getModRageCardsId, getModSpecialCardsId } from "./useModCardsId";

export const fetchCardsConfig = async (client: any, modId: string) => {
  if (modId) {
    const modSpecialCards = await getModSpecialCardsId(client, modId);
    const modRageCards = await getModRageCardsId(client, modId);

    if (modSpecialCards) {
      const modCardsConfig: ModCardsConfig = {
        // exclude cards that belong to a season or a collection
        specialCardsIds: modSpecialCards.filter((cardId: number) => cardId < 10100),
        rageCardsIds: modRageCards,
      };
      return modCardsConfig;
    }
  }
};
