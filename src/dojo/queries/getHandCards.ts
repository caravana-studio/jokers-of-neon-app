import { SortBy } from "../../enums/sortBy";
import { Card } from "../../types/Card";
import { sortCards } from "../../utils/sortCards";

export const getHandCards = async (
  client: any,
  gameId: number,
  sortBy: SortBy
): Promise<any> => {
  try {
    let tx_result: any = await client.game_views.getHandCards(gameId);

    console.log("game cards", tx_result);

    const cards: Card[] = tx_result.map((card: BigInt, index: number) => {
      const card_id = Number(card);
      return {
        card_id,
        img: `${card_id}.png`,
        isModifier: card_id >= 600 && card_id <= 700,
        idx: index,
        id: index.toString(),
      };
    });

    return sortCards(cards, sortBy);
  } catch (e) {
    console.log(e);
    return;
  }
};
