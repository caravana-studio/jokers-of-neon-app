// Calculate progressive burn cost based on contract formula:
// price = initial_price_of_burn + (count_burns * 100)
// Each card burned increments count_burns, so for N cards:
// Card 1: base, Card 2: base+100, Card 3: base+200, ...
// Total = firstCardCost + (N-1)*regularCost + 100*(1+2+...+(N-1))
//       = firstCardCost + (N-1)*regularCost + 100*(N-1)*N/2
export const calculateBurnCost = (
  numCards: number,
  firstCardCost: number,
  regularCost: number
): number => {
  if (numCards === 0) return 0;
  if (numCards === 1) return firstCardCost;
  const remainingCards = numCards - 1;
  const remainingCost =
    remainingCards * regularCost +
    100 * ((remainingCards * numCards) / 2);
  return firstCardCost + remainingCost;
};
