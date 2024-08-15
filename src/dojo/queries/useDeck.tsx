import { Deck } from "../../types/Deck";
import { useGame } from "./useGame";
import { useRound } from "./useRound";

export const useDeck = (): Deck => {
  const game = useGame();
  const round = useRound();

  return {
    size: (game?.len_common_cards ?? 0) + (game?.len_effect_cards ?? 0),
    currentLength: round?.current_len_deck ?? 0,
  };
};
