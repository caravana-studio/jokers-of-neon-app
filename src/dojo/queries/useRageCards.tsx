import { useGameStore } from "../../state/useGameStore";
import { useRound } from "./useRound";

export const useRageCards = () => {
  const { rageCards } = useGameStore();
  if (rageCards || rageCards.length === 0) {
    return [];
  }
  const dojoRageCards = rageCards.map((c: any, index: number) => {
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
