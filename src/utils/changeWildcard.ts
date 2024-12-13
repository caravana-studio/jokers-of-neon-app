
export const changeWildcard = (card_id: number): number => {
  if (card_id >= 0 && card_id < 53)
    return 53;
  else if (card_id >= 200 && card_id < 253)
    return 253;
  else 
    return card_id;
};
