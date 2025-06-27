import { Card } from "../../types/Card";

const getSellingPrice = (specialCard: any) => {
  let price;

  if (specialCard.is_temporary && specialCard.remaining) {
    price = (specialCard.selling_price / 3) * specialCard.remaining;
  } else {
    price = specialCard.selling_price;
  }

  return Math.round(price / 50) * 50;
};

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

const getSpecialCards = (specialIds: BigInt[]) => {
  return specialIds.map((card_id: BigInt, index: number) => {
    return {
      card_id: Number(card_id),
      isSpecial: true,
      id: card_id?.toString(),
      idx: index ?? 0,
      img: `${card_id}.png`,
      //temporary: specialCard?.is_temporary,
      //remaining: specialCard?.remaining,
      //selling_price: getSellingPrice(specialCard),
    };
  });
};
