import { useRound } from "./useRound";

export const useRageCards = () => {
  const round = useRound();
  console.log("round", round);
  if (!round || !round.rages || round.rages.length === 0) {
    return [];
  }
  const dojoRageCards = round.rages.map((c: any, index: number) => {
    const card_id = c && (c as any).value;
    return {
      card_id,
      isSpecial: false,
      id: card_id?.toString(),
      idx: index ?? 0,
      img: `${card_id}.png`,
    };
  });

  return dojoRageCards ?? [];
};
