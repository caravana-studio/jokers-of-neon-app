
export const changeCardNeon = (traditional_card_id: number): number => {
  if (traditional_card_id >= 0 && traditional_card_id < 53)
    return traditional_card_id + 200;
  
  return traditional_card_id;
};
