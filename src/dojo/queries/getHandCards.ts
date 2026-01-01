import { SortBy } from "../../enums/sortBy";
import { Card } from "../../types/Card";
import { sortCards } from "../../utils/sortCards";

const VITE_HAND_QUERY_MAX_ATTEMPTS =
  import.meta.env.VITE_HAND_QUERY_MAX_ATTEMPTS || "5";
const VITE_HAND_QUERY_RETRY_DELAY_MS =
  import.meta.env.VITE_HAND_QUERY_RETRY_DELAY_MS || "500";
  const MAX_ATTEMPTS = Number(VITE_HAND_QUERY_MAX_ATTEMPTS);
  const RETRY_DELAY_MS = Number(VITE_HAND_QUERY_RETRY_DELAY_MS);

export const getHandCards = async (
  client: any,
  gameId: number,
  sortBy: SortBy
): Promise<any> => {

  try {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const tx_result: any = await client.game_views.getHandCards(gameId);

      const cards: Card[] = (tx_result ?? []).map(
        (card: BigInt, index: number) => {
          const card_id = Number(card);
          return {
            card_id,
            img: `${card_id}.png`,
            isModifier: card_id >= 600 && card_id <= 700,
            isNeon: card_id >= 200 && card_id < 300,
            idx: index,
            id: index.toString(),
          };
        }
      );

      if (cards.length > 0 || attempt === MAX_ATTEMPTS) {
        return sortCards(cards, sortBy);
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  } catch (e) {
    console.log(e);
    return;
  }
};
