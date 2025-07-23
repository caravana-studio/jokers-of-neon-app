interface DojoDeckCard {
  0: BigInt;
  1: boolean
}

export interface DeckCard {
  card_id: number;
  used: boolean;
}

export const getDeck = async (
  client: any,
  gameId: number
): Promise<DeckCard[]> => {
  try {
    let deck_cards: any = await client.game_system.getDeckCards(gameId);

    return deck_cards.map((card: DojoDeckCard) => {
      return {
        card_id: Number(card[0]),
        used: !card[1],
      }
    })
  } catch (e) {
    console.log(e);
    return [];
  }
};
