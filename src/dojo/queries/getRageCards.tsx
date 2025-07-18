export const getRageCards = (rageIds: number[]) => {
  return rageIds.map((card_id: number, index: number) => {
    return {
      card_id,
      isSpecial: false,
      id: card_id?.toString(),
      idx: index ?? 0,
      img: `${card_id}.png`,
    };
  });
};
