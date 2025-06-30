import { Card } from "../../types/Card";

export const getSpecialCardsView = async (
  client: any,
  gameId: number
): Promise<Card[]> => {
  try {
    let tx_result: any = await client.game_system.getSpecialCards(gameId);

    console.log("sepcial cards view", tx_result);
    return getSpecialCards(tx_result);
  } catch (e) {
    console.error("error getting specials view", e);
    return [];
  }
};

interface SpecialCardDojo {
  effect_card_id: BigInt;
  game_id: BigInt;
  idx: BigInt;
  is_temporary: boolean;
  remaining: BigInt;
  selling_price: BigInt;
}

const getSpecialCards = (specialCards: SpecialCardDojo[]) => {
  return specialCards.map((card: SpecialCardDojo, index: number) => {
    const card_id = Number(card.effect_card_id);
    return {
      card_id,
      isSpecial: true,
      id: card_id?.toString(),
      idx: index ?? 0,
      img: `${card_id}.png`,
      temporary: card?.is_temporary,
      remaining: Number(card?.remaining),
      selling_price: Number(card?.selling_price),
    };
  });
};
