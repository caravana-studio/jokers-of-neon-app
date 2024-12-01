import { Deck } from "../../types/Deck";
import { useDojo } from "../useDojo";
import { getCard } from "./useCurrentHand";
import { getCardFromCardId } from "../utils/getCardFromCardId";
import { getCardData } from "../../utils/getCardData";
import { getLSGameId } from "../utils/getLSGameId";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Entity } from "@dojoengine/recs";
import { useComponentValue } from "@dojoengine/react";
import { useMemo } from "react";

export const useDeck = (): Deck => {
  const {
    setup: {
      clientComponents: { GameDeck, DeckCard },
    },
  } = useDojo();
  const gameId = getLSGameId();

  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(gameId)]) as Entity,
    [gameId]
  );

  const deck = useComponentValue(GameDeck, entityId);

  const fullDeckCards = [];
  const usedDeckCards = [];

  if (deck?.len) {
    for (let i = 0; i < deck?.len; i++) {
      const deckCard = getCard(gameId ?? 0, i, DeckCard);
      const card = getCardFromCardId(deckCard?.card_id, i);
      const cardData = { ...getCardData(card) };
      const isNeonCard = card.card_id >= 200 && card.card_id <= 252;

      fullDeckCards.push({
        ...card,
        ...cardData,
        isNeon: isNeonCard,
      });

      if (i >= deck?.round_len) {
        usedDeckCards.push({
          ...card,
          ...cardData,
          isNeon: isNeonCard,
        });
      }
    }
  }

  return {
    size: deck?.len || 0,
    currentLength: deck?.round_len || 0,
    fullDeckCards: fullDeckCards,
    usedCards: usedDeckCards,
  };
};
