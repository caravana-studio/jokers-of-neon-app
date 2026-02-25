export const hasPriceValue = (
  price: number | null | undefined
): price is number => price !== undefined && price !== null;

export const getEffectivePrice = (
  price: number | null | undefined,
  discountPrice?: number | null
): number => {
  if (discountPrice !== undefined && discountPrice !== null && discountPrice > 0) {
    return discountPrice;
  }

  return Number(price ?? 0);
};
