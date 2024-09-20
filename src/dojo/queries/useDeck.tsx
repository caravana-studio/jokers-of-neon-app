import { Deck } from "../../types/Deck";
import { useDojo } from "../useDojo";
import { useGame } from "./useGame";
import { useRound } from "./useRound";
import { getCard } from "./useCurrentHand";
import { Card } from "../../types/Card";
import { useComponentValue } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Entity } from "@dojoengine/recs";
import { Suits } from "../../enums/suits";
import { getCardFromCardId } from "../utils/getCardFromCardId";
import { getCardData } from "../../utils/getCardData";

export const useDeck = (): Deck | undefined => {
  const game = useGame();
  const round = useRound();
  const deckSize = (game?.len_common_cards ?? 0) + (game?.len_effect_cards ?? 0);
  const cards = [];

  const {
    setup: {
      clientComponents: { DeckCard },
    },
  } = useDojo();

  if (!game) return undefined;

  for (let i = 0; i < deckSize; i++) {
    const deckCard = getCard(game.id ?? 0, i, DeckCard);
    const card = getCardFromCardId(deckCard?.card_id, i);
    const cardData = {...getCardData(card)};
    cards.push({
        ...card,
        ...cardData,
        img: `${deckCard?.type_player_card === "Effect" ? "effect/" : ""}${deckCard?.card_id}.png`,
        idx: deckCard?.idx,
        id: deckCard?.card_id.toString(),

      });
  }

  return {
    size: deckSize,
    currentLength: round?.current_len_deck ?? 0,
    cards: cards
  };
};
