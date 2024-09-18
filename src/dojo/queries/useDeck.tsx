import { Deck } from "../../types/Deck";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";
import { useRound } from "./useRound";
import { getCard } from "./useCurrentHand";
import { Card } from "../../types/Card";

export const useDeck = (): Deck | undefined => {
  const game = useGame();
  const round = useRound();
  const deckSize = (game?.len_common_cards ?? 0) + (game?.len_effect_cards ?? 0);
  const dojoCards = [];

  const {
    setup: {
      clientComponents: { DeckCard },
    },
  } = useDojo();

  if (!game) return undefined;

  for (let i = 0; i < deckSize; i++) {
    dojoCards.push(getCard(game.id ?? 0, i, DeckCard));
  }

  const cards: Card[] = dojoCards
    // filter out null cards (represented by card_id 9999)
    .filter((card) => card?.card_id !== 9999)
    .map((dojoCard) => {
      return {
        ...dojoCard,
        img: `${dojoCard?.type_player_card === "Effect" ? "effect/" : ""}${dojoCard?.card_id}.png`,
        isModifier: dojoCard?.type_player_card === "Effect",
        idx: dojoCard?.idx,
        id: dojoCard?.idx.toString(),
      };
    });

  return {
    size: deckSize,
    currentLength: round?.current_len_deck ?? 0,
    cards: cards
  };
};
