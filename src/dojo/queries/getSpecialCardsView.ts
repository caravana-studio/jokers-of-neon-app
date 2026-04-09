import { Card } from "../../types/Card";

export const getSpecialCardsView = async (
  client: any,
  gameId: number
): Promise<Card[]> => {
  try {
    let tx_result: any = await client.game_views.getSpecialCards(gameId);
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
  is_silenced: boolean;
  remaining: BigInt;
  selling_price: BigInt;
}

const getSpecialCards = (specialCards: SpecialCardDojo[]) => {
  return specialCards
    .filter((card) => Number(card.effect_card_id) > 0)
    .map((card: SpecialCardDojo, index: number) => {
      const card_id = Number(card.effect_card_id);
      const idx = Number(card.idx ?? index);
      return {
        card_id,
        isSpecial: true,
        id: `${card_id}-${idx}`,
        idx,
        img: `${card_id}.png`,
        temporary: card?.is_temporary,
        remaining: Number(card?.remaining),
        selling_price: Number(card?.selling_price),
        silenced: card?.is_silenced,
      };
    });
};
