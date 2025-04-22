import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useMemo } from "react";
import { CardTypes } from "../../enums/cardTypes";
import { useCardData } from "../../providers/CardDataProvider";
import { Deck } from "../../types/Deck";
import { useDojo } from "../useDojo";
import { getCardFromCardId } from "../utils/getCardFromCardId";
import { getLSGameId } from "../utils/getLSGameId";
import { getCard } from "./useCurrentHand";

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

  const { getCardData } = useCardData();

  const deck = useComponentValue(GameDeck, entityId);

  const fullDeckCards = [];
  const usedDeckCards = [];

  if (deck?.len) {
    for (let i = 0; i < deck?.len; i++) {
      const deckCard = getCard(gameId ?? 0, i, DeckCard);
      const card = getCardFromCardId(deckCard?.card_id, i);
      const cardData = getCardData(card.card_id);
      const isNeonCard = cardData.type === CardTypes.NEON;

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
