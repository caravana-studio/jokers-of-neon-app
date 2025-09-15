import { Card } from "../../types/Card";
const sort = (a: Card, b: Card) => {
  return (a.card_id ?? 0) - (b.card_id ?? 0);
};

export const getLootBoxResult = async (
  client: any,
  gameId: number
): Promise<any> => {
  try {
    let tx_result: any = await client.shop_views.getLootBoxResult(gameId);
    const cards: Card[] = tx_result.cards.map((card: BigInt, index: number) => {
      const card_id = Number(card);
      return {
        card_id,
        img: `${card_id}.png`,
        idx: index,
        id: index.toString(),
      };
    });

    return cards.sort(sort);
  } catch (e) {
    console.log(e);
    return;
  }
};
