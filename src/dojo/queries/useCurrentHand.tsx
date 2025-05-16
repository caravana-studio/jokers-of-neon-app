import { Component, Entity, getComponentValue } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { SortBy } from "../../enums/sortBy";
import { Card } from "../../types/Card";
import { sortCards } from "../../utils/sortCards";
import { useDojo } from "../useDojo";
import { useEffect, useState } from "react";
import { useGame } from "./useGame";

export const getCard = (gameId: number, index: number, entity: Component) => {
  const entityId = getEntityIdFromKeys([
    BigInt(gameId),
    BigInt(index),
  ]) as Entity;
  return getComponentValue(entity, entityId);
};

export const useCurrentHand = (sortBy: SortBy) => {
  const {
    setup: {
      clientComponents: { CurrentHand },
    },
  } = useDojo();

  const game = useGame();
  const [sortedCards, setSortedCards] = useState<Card[]>([]);

  useEffect(() => {
    const loadCurrentHand = () => {
      const entityId = getEntityIdFromKeys([BigInt(game?.id ?? 0)]) as Entity;
      const currentHand = getComponentValue(CurrentHand, entityId);

      if (game?.id === undefined || game?.id === null) return; // <-- fix: no return value

      const dojoCards = currentHand?.cards ?? [];

      const cards: Card[] = dojoCards.map((card: any, index: number) => {
        const card_id = card.value;
        return {
          card_id,
          img: `${card_id}.png`,
          isModifier: card_id >= 600 && card_id <= 700,
          idx: index,
          id: index.toString(),
        };
      });

      setSortedCards(sortCards(cards, sortBy));
    };

    loadCurrentHand();

    if (sortedCards.length === 0) {
      const retryTimeout = setTimeout(() => {
        loadCurrentHand();
      }, 1000);

      return () => clearTimeout(retryTimeout);
    }
  }, [game?.id]);

  return sortedCards;
};
